const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QAsW0JWonOOC6woHSJyCjoQyWeqPdbq2m9kFupyMbIqFX7Sio94QgXkVKYmKSX7pKzA6AxkjEyoDCyBGP8lQ5en004pnQIZYQ');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Enable body-parser to handle JSON requests

// MySQL Connection
// const db = mysql.createConnection({
//   host: '192.168.10.3',
//   user: 'root',
//   password: '1234',
//   database: 'project_db',
// });
const db = mysql.createPool({
  host: "192.168.10.3",
  user: "root",
  password: "1234", // Replace with your database password
  database: "project_db", // Replace with your database name
});


// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chbroo5512@gmail.com',
    pass: 'mjxrvbxvfuehxdce',
  },
});

// OTP Generation and Signup Route
// Example signup route on the backend
// OTP Generation and Signup Route
app.post('/Signup', (req, res) => {
  const { name, email, username, password, country } = req.body;

  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save the user data along with OTP in the users table
  const userQuery = 'INSERT INTO users (name, email, username, password, country, otp) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(userQuery, [name, email, username, password, country, otp], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ success: false, message: 'Failed to create user' });
    } else {
      // Get the inserted user's ID
      const userId = results.insertId;
      
      // Automatically insert a record into the profile table for this user
      const profileQuery = 'INSERT INTO profile (user_id, country, created_at) VALUES (?, ?, NOW())';
      
      db.query(profileQuery, [userId, country], (profileErr) => {
        if (profileErr) {
          console.error('Error inserting profile:', profileErr);
          return res.status(500).json({ success: false, message: 'Failed to create profile' });
        }
        
        // Send OTP via email after successfully creating the user and profile
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: email,
          subject: 'OTP Verification',
          text: `Your OTP code is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send OTP' });
          } else {
            console.log('OTP sent:', info.response);
            res.status(200).json({ success: true, message: 'User and profile created successfully, OTP sent', userId });
          }
        });
      });
    }
  });
});

    // OTP Verification Route
// app.post('/verifyOTP', (req, res) => {
//   const { userId, otp } = req.body;

//   const query = 'SELECT * FROM users WHERE id = ? AND otp = ?';
  
//   db.query(query, [userId, otp], (err, results) => {
//     if (err) {
//       console.error('Error verifying OTP:', err);
//       res.status(500).json({ success: false, message: 'OTP verification failed' });
//     } else if (results.length > 0) {
//       res.status(200).json({ success: true, message: 'OTP verified successfully' });
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid OTP' });
//     }
//   });
// });

app.post('/verifyOTP', (req, res) => {
    const { userId, otp, isRecovery } = req.body;  // Assuming 'isRecovery' is a flag to indicate which process (signup or recovery)
  
    const query = 'SELECT * FROM users WHERE id = ? AND otp = ?';
    
    db.query(query, [userId, otp], (err, results) => {
      if (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ success: false, message: 'OTP verification failed' });
      } else if (results.length > 0) {
        // OTP is valid
        console.log('OTP verified for userId:', userId);
        
        // Check if it's for recovery or signup
        if (isRecovery) {
          // OTP is for password recovery
          res.status(200).json({ success: true, message: 'OTP verified for password recovery', nextStep: 'createNewPassword' });
        } else {
          // OTP is for signup verification
          res.status(200).json({ success: true, message: 'OTP verified for signup', nextStep: 'completeSignup' });
        }
  
        // Optionally, you can clear the OTP after successful verification
        db.query('UPDATE users SET otp = NULL WHERE id = ?', [userId], (updateErr) => {
          if (updateErr) {
            console.error('Error clearing OTP:', updateErr);
          }
        });
  
      } else {
        // OTP is invalid
        res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
    });
  });
  

//Login

// server.js

app.post('/login', async (req, res) => {
  console.log("Received login request:", req.body);
  const { username, password } = req.body;

  try {
    // Verify user credentials
    const userQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const [users] = await db.query(userQuery, [username, password]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];

    // Check if user is an approved artist
    const artistQuery = 'SELECT artist_id FROM approved_artists WHERE user_id = ?';
    const [artistResults] = await db.query(artistQuery, [user.id]);

    const artistId = artistResults.length > 0 ? artistResults[0].artist_id : null;

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Login successful',
      userId: user.id,
      artistId,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
});



  

  //RecoverPasswoord
  app.post('/recover-password', (req, res) => {
    const { usernameOrEmail } = req.body;
  
    // Query to check if the username or email exists in the database
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    
    db.query(query, [usernameOrEmail, usernameOrEmail], (err, results) => {
      if (err) {
        console.error('Error checking account:', err);
        res.status(500).json({ success: false, message: 'An error occurred' });
      } else if (results.length > 0) {
        // User exists, generate OTP
        const user = results[0];
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
  
        // Update OTP in the database
        const updateOtpQuery = 'UPDATE users SET otp = ? WHERE id = ?';
        db.query(updateOtpQuery, [otp, user.id], (updateErr) => {
          if (updateErr) {
            console.error('Error updating OTP:', updateErr);
            res.status(500).json({ success: false, message: 'Failed to generate OTP' });
          } else {
            // Send OTP via email
            const mailOptions = {
              from: 'your-email@gmail.com',
              to: user.email,
              subject: 'Password Recovery OTP',
              text: `Your OTP for password recovery is: ${otp}`,
            };
  
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log('Error sending email:', error);
                res.status(500).json({ success: false, message: 'Failed to send OTP' });
              } else {
                console.log('OTP sent:', info.response);
                res.status(200).json({ success: true, message: 'OTP sent successfully', userId: user.id });
              }
            });
          }
        });
      } else {
        // No account found
        res.status(404).json({ success: false, message: 'Account not found' });
      }
    });
  });

  
  //create new password

  app.post('/update-password', (req, res) => {
    const { userId, newPassword } = req.body;
  
    // Query to update the user's password
    const query = 'UPDATE users SET password = ? WHERE id = ?';
  
    db.query(query, [newPassword, userId], (err) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ success: false, message: 'Failed to update password' });
      } else {
        res.status(200).json({ success: true, message: 'Password updated successfully' });
      }
    });
  });
  // Fetch user profile data
app.get('/getUserProfile', (req, res) => {
    const userId = req.query.userId;  // Get user ID from query params
  
    const query = `
      SELECT u.name, u.email, p.profile_picture, p.bio, p.country
      FROM users u
      LEFT JOIN profile p ON u.id = p.user_id
      WHERE u.id = ?
    `;
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
      }
      if (result.length > 0) {
        return res.status(200).json({ success: true, data: result[0] });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    });
  });
  

  // Update user profile (name, email, bio, profile picture, etc.)
  app.post('/updateProfile', (req, res) => {
    const { userId, name, bio, country } = req.body;  // Retrieve userId, name, bio, and country from body

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // First, update the user's name in the users table
    const updateUserQuery = 'UPDATE users SET name = ? WHERE id = ?';
    db.query(updateUserQuery, [name, userId], (err, result) => {
        if (err) {
            console.error('Error updating user name:', err);
            return res.status(500).json({ success: false, message: 'Failed to update user name' });
        }

        // Now update bio and country in the profile table or insert a new row if it doesn't exist
        const updateProfileQuery = `
            INSERT INTO profile (user_id, bio, country)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                bio = VALUES(bio),
                country = VALUES(country),
                updated_at = NOW()
        `;

        db.query(updateProfileQuery, [userId, bio, country], (err, result) => {
            if (err) {
                console.error('Error updating profile:', err);
                return res.status(500).json({ success: false, message: 'Failed to update profile' });
            }
            return res.status(200).json({ success: true, message: 'Profile updated successfully' });
        });
    });
});




  


  
  // Google Login with Email Verification Link
app.post('/sendVerificationLink', (req, res) => {
    const { email } = req.body;
  
    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
  
    const saveTokenQuery = 'INSERT INTO email_verification (email, token) VALUES (?, ?)';
    db.query(saveTokenQuery, [email, verificationToken], (err, result) => {
      if (err) {
        console.error('Error saving token:', err);
        res.status(500).json({ success: false, message: 'Failed to generate verification link' });
      } else {
        const verificationLink = `http://your-frontend-url.com/create-password?token=${verificationToken}`;
        const mailOptions = {
          from: 'chbroo5512@gmail.com',
          to: email,
          subject: 'Verify your account',
          text: `Please click the following link to create your password: ${verificationLink}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send email' });
          } else {
            res.status(200).json({ success: true, message: 'Verification email sent successfully' });
          }
        });
      }
    });
  });
  //stripe payment
  // app.post('/create-payment-intent', async (req, res) => {
  //   const { amount } = req.body; // Amount should be in the smallest currency unit (cents for USD)
  
  //   try {
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount,
  //       currency: 'usd',
  //       payment_method_types: ['card'], // Only cards are supported for now
  //     });
  
  //     res.json({
  //       clientSecret: paymentIntent.client_secret,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  
  app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Your Product Name',
              },
              unit_amount: amount, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://emailsignature.alrehmancollegeofnursing.com/payment-success.html', // Custom deep link for success
        cancel_url: 'https://emailsignature.alrehmancollegeofnursing.com/payment-cancel.html',  // Custom deep link for cancel
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });
//become Artist
  
// Make sure to use the defined 'connection' object in this route
// Handle the "Become an Artist" request
app.post('/become-artist', (req, res) => {
  const { name, email, country, trackStack, bio, subscriptionPrice, user_id } = req.body;

  const query = 'INSERT INTO artists_requests (name, email, country, track_stack, bio, subscription_price, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, email, country, trackStack, bio, subscriptionPrice, user_id], (err, result) => {
    if (err) {
      console.error('Error inserting artist request:', err);
      res.status(500).json({ error: 'Failed to submit artist request' });
    } else {
      res.json({ success: true });
    }
  });
});

app.get('/get-artist-request', async (req, res) => {
  const { user_id } = req.query; // Expecting user_id as a query parameter

  const query = `
    SELECT 
      name, 
      email, 
      country, 
      track_stack AS trackStack, 
      bio, 
      subscription_price AS subscriptionPrice, 
      user_id AS userId 
    FROM artists_requests 
    WHERE user_id = ?`;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching artist request details:', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve artist request details' });
    } else if (results.length > 0) {
      // If a record is found, return it as an artistRequest object
      const artistRequest = {
        name: results[0].name,
        email: results[0].email,
        country: results[0].country,
        trackStack: results[0].trackStack,
        bio: results[0].bio,
        subscriptionPrice: results[0].subscriptionPrice,
        userId: results[0].userId
      };

      res.json({ success: true, artistRequest });
    } else {
      // If no record is found
      res.json({ success: false, message: 'No artist request found for this user' });
    }
  });
});



// Endpoint to create a new post
app.post('/create-post', async (req, res) => {
  const { artistId, content, mediaUrl, mediaType } = req.body;

  // Log received artistId
  console.log("Received artistId for post creation:", artistId);

  // Check if artistId exists in approved_artists table
  const query = 'SELECT * FROM approved_artists WHERE artist_id = ?';
  await db.query(query, [artistId], (err, results) => {
      if (err) {
          console.error('Database error in create-post:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
          console.warn('Create post failed: User is not an approved artist');
          return res.status(403).json({ success: false, message: 'User is not an approved artist' });
      }

      // Proceed with post creation if the artist is approved
      const insertQuery = 'INSERT INTO posts (artist_id, content, media_url, media_type) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [artistId, content, mediaUrl, mediaType], (err, result) => {
          if (err) {
              console.error('Error inserting post in create-post:', err);
              return res.status(500).json({ success: false, message: 'Failed to create post' });
          }
          console.log('Post created successfully');
          res.json({ success: true, message: 'Post created successfully' });
      });
  });
});




// server.js

// Endpoint to retrieve artist_id based on user_id
app.get('/get-artist-id', async (req, res) => {
  const { userId } = req.query;

  const query = 'SELECT artist_id,name, user_id FROM approved_artists WHERE user_id = ?';
 await db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching artist ID:', err);
          res.status(500).json({ success: false, message: 'Error retrieving artist ID' });
      } else {
          console.log('Query results of Get Artist Data:', results); // Log the results to debug

          if (results.length > 0) {
              // If artist ID is found, return it
              res.json({ success: true, artistId: results[0].artist_id, artistNames: results[0].name });
              
          } else {
              // If user is not an approved artist, return a specific message
              res.json({ success: false, message: 'User is not an approved artist' });
          }
      }
  });
});

app.get('/approved-artists', async(req, res) => {
  const query = 'SELECT artist_id AS id, name, user_id FROM approved_artists';

 await db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching approved artists:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch artists' });
    } else {
      res.json({ success: true, artists: results });
    }
  });
});


// Endpoint to get posts for a specific artist

// Get Posts Endpoint
app.get('/get-posts', async (req, res) => {
  const artistId = req.query.artistId;
  const userId = req.query.userId;

  console.log("Fetching posts for artistId:", artistId);

  const query = `
    SELECT 
        posts.*, 
        approved_artists.name AS artist_name,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
        CASE 
    WHEN EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) THEN 1
    ELSE 0
END AS isLiked,

        COALESCE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', comments.id, 
                    'text', comments.comment_text,
                    'user_id', comments.user_id,
                    'user_name', users.name,
                    'created_at', comments.created_at
                )
            ), '[]'
        ) AS comments
    FROM posts
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN users ON comments.user_id = users.id
    LEFT JOIN approved_artists ON posts.artist_id = approved_artists.artist_id
    WHERE posts.artist_id = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC;
  `;

  await db.query(query, [userId, artistId], (err, posts) => {
    if (err) {
      console.error('Error fetching posts in get-posts:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }

    const formattedPosts = posts.map(post => {
      let parsedComments;
      try {
        parsedComments = JSON.parse(post.comments || '[]'); // Safely parse the comments JSON
        // Sort comments by created_at descending
        parsedComments = parsedComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } catch (err) {
        console.error(`Error parsing comments for post ${post.id}:`, err);
        parsedComments = []; // Fallback to an empty array on error
      }

      return {
        ...post,
        isLiked: post.isLiked === 1, // Convert to boolean
        comments: parsedComments, // Use sorted comments
        like_count: post.like_count || 0 // Ensure like_count is a valid number
      };
    });

    res.json({ success: true, posts: formattedPosts });
  });
});
















// Like/Unlike Post Endpoint
app.post('/like-post', (req, res) => {
  const { postId, userId } = req.body;

  // Check if the user has already liked the post
  const checkLikeQuery = 'SELECT id FROM likes WHERE post_id = ? AND user_id = ?';
  db.query(checkLikeQuery, [postId, userId], (err, likeResults) => {
    if (err) {
      console.error('Error checking like status:', err);
      return res.status(500).json({ success: false, message: 'Failed to like/unlike post' });
    }

    if (likeResults.length > 0) {
      // Unlike the post if already liked
      const deleteLikeQuery = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
      db.query(deleteLikeQuery, [postId, userId], (err) => {
        if (err) {
          console.error('Error unliking post:', err);
          return res.status(500).json({ success: false, message: 'Failed to unlike post' });
        }

        // Decrement like_count in posts table
        const decrementLikeQuery = 'UPDATE posts SET like_count = like_count - 1 WHERE id = ?';
        db.query(decrementLikeQuery, [postId], (err) => {
          if (err) {
            console.error('Error decrementing like count:', err);
            return res.status(500).json({ success: false, message: 'Failed to update like count' });
          }
          return res.json({ success: true, message: 'Post unliked successfully' });
        });
      });
    } else {
      // Like the post if not already liked
      const insertLikeQuery = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
      db.query(insertLikeQuery, [postId, userId], (err) => {
        if (err) {
          console.error('Error liking post:', err);
          return res.status(500).json({ success: false, message: 'Failed to like post' });
        }

        // Increment like_count in posts table
        const incrementLikeQuery = 'UPDATE posts SET like_count = like_count + 1 WHERE id = ?';
        db.query(incrementLikeQuery, [postId], (err) => {
          if (err) {
            console.error('Error incrementing like count:', err);
            return res.status(500).json({ success: false, message: 'Failed to update like count' });
          }
          return res.json({ success: true, message: 'Post liked successfully' });
        });
      });
    }
  });
});


// Add Comment Endpoint
app.post('/add-comment', async (req, res) => {
  const { postId, userId, commentText } = req.body;

  const query = `
    INSERT INTO comments (post_id, user_id, comment_text)
    VALUES (?, ?, ?)
  `;

  await db.query(query, [postId, userId, commentText], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ success: false, message: 'Failed to add comment' });
    } else {
      res.json({ success: true, commentId: result.insertId });
    }
  });
});

app.post('/subscribe', (req, res) => {
  const { user_id, artist_id } = req.body;

  // First, check if the subscription already exists
  const checkQuery = `
      SELECT * FROM subscriptions WHERE user_id = ? AND artist_id = ?
  `;

  db.query(checkQuery, [user_id, artist_id], (err, results) => {
    if (err) {
      console.error('Error checking subscription:', err);
      return res.status(500).json({ success: false, message: 'Failed to check subscription' });
    }

    if (results.length > 0) {
      // If the subscription already exists, return a message
      return res.json({ success: false, message: 'You already have subscribed to this artist' });
    }

    // If not subscribed, proceed to insert the subscription
    const insertQuery = `
        INSERT INTO subscriptions (user_id, artist_id)
        VALUES (?, ?)
    `;

    db.query(insertQuery, [user_id, artist_id], (err, result) => {
      if (err) {
        console.error('Error adding subscription:', err);
        return res.status(500).json({ success: false, message: 'Failed to subscribe' });
      }

      res.json({ success: true, subscription_id: result.insertId });
    });
  });
});
//feed
// app.get('/get-feed', (req, res) => {
//   const userId = req.query.userId;

//   const query = `
//     SELECT 
//         posts.*, 
//         approved_artists.name AS artist_name,
//         (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
//         EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS isLiked,
//         COALESCE(
//             JSON_ARRAYAGG(
//                 CASE 
//                     WHEN comments.id IS NOT NULL THEN 
//                         JSON_OBJECT(
//                             'id', comments.id, 
//                             'text', comments.comment_text,
//                             'user_id', comments.user_id,
//                             'user_name', users.name,
//                             'created_at', comments.created_at
//                         )
//                     ELSE NULL
//                 END
//             ), '[]'
//         ) AS comments
//     FROM posts
//     LEFT JOIN subscriptions ON posts.artist_id = subscriptions.artist_id
//     LEFT JOIN approved_artists ON posts.artist_id = approved_artists.artist_id
//     LEFT JOIN comments ON posts.id = comments.post_id
//     LEFT JOIN users ON comments.user_id = users.id
//     WHERE subscriptions.user_id = ?
//     GROUP BY posts.id
//     ORDER BY posts.created_at DESC;
//   `;

//   db.query(query, [userId, userId], (err, posts) => {
//     if (err) {
//       console.error('Error fetching feed:', err);
//       return res.status(500).json({ success: false, message: 'Failed to fetch feed' });
//     }

//     const formattedPosts = posts.map(post => {
//       let parsedComments;
//       try {
//         parsedComments = JSON.parse(post.comments || '[]'); // Safely parse the comments JSON
//         // Ensure comments are filtered to remove null values
//         parsedComments = parsedComments.filter(comment => comment !== null);
//       } catch (err) {
//         console.error(`Error parsing comments for post ${post.id}:`, err);
//         parsedComments = [];
//       }

//       return {
//         ...post,
//         isLiked: post.isLiked === 1, // Convert to boolean
//         comments: parsedComments, // Use filtered comments
//         comment_count: parsedComments.length, // Use the actual length of parsed comments
//         like_count: post.like_count || 0 // Ensure like_count is a valid number
//       };
//     });

//     res.json({ success: true, posts: formattedPosts });
//   });
// });
app.get('/get-feed', async (req, res) => {
  const userId = req.query.userId;

  const query = `
    SELECT 
        posts.*, 
        approved_artists.name AS artist_name,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
        EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS isLiked,
        COALESCE(
            JSON_ARRAYAGG(
                CASE 
                    WHEN comments.id IS NOT NULL THEN 
                        JSON_OBJECT(
                            'id', comments.id, 
                            'text', comments.comment_text,
                            'user_id', comments.user_id,
                            'user_name', users.name,
                            'created_at', comments.created_at
                        )
                    ELSE NULL
                END
            ), '[]'
        ) AS comments
    FROM posts
    LEFT JOIN subscriptions ON posts.artist_id = subscriptions.artist_id
    LEFT JOIN approved_artists ON posts.artist_id = approved_artists.artist_id
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN users ON comments.user_id = users.id
    WHERE subscriptions.user_id = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC;
  `;

  try {
    // Use a promise-based query
    const [posts] = await db.query(query, [userId, userId]);

    const formattedPosts = posts.map(post => {
      let parsedComments;
      try {
        parsedComments = JSON.parse(post.comments || '[]'); // Safely parse the comments JSON
        // Ensure comments are filtered to remove null values
        parsedComments = parsedComments.filter(comment => comment !== null);
      } catch (err) {
        console.error(`Error parsing comments for post ${post.id}:`, err);
        parsedComments = [];
      }

      return {
        ...post,
        isLiked: post.isLiked === 1, // Convert to boolean
        comments: parsedComments, // Use filtered comments
        comment_count: parsedComments.length, // Use the actual length of parsed comments
        like_count: post.like_count || 0 // Ensure like_count is a valid number
      };
    });

    res.json({ success: true, posts: formattedPosts });
  } catch (err) {
    console.error('Error fetching feed:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch feed' });
  }
});





// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir); // Create `uploads` directory if it doesn't exist
// }

// // Multer Configuration for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // Save files in `uploads` directory
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // Serve Uploaded Files
// app.use("/uploads", express.static(uploadDir));

// // API: Upload Music and Save Metadata
// app.post("/upload-music", upload.single("file"), (req, res) => {
//   const file = req.file;
//   const { title = "Untitled", type = "Unknown" } = req.body; // Optional title and type

//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

//   // Insert Metadata into Database
//   const query = `
//     INSERT INTO artistmusiclibrary (title, type, file_url, created_at)
//     VALUES (?, ?, ?, NOW())
//   `;
//   db.query(query, [title, type, fileUrl], (err, result) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ message: "Failed to save file metadata in database" });
//     }
//     res.status(201).json({
//       message: "File uploaded and metadata saved successfully",
//       fileUrl,
//     });
//   });
// });

// // API: Fetch All Music Files
// app.get("/music", (req, res) => {
//   const query = "SELECT * FROM artistmusiclibrary";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ message: "Failed to fetch music files" });
//     }
//     res.status(200).json(results); // Send the list of music files as JSON
//   });
// });


// Create Upload Directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Serve Static Files
app.use("/uploads", express.static(uploadDir));

// API to Create Album
app.post("/create-album", upload.single("cover"), async (req, res) => {
  console.log("Got request to create album");
  const { title } = req.body;
  const coverUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

  if (!title) {
    return res.status(400).json({ message: "Album title is required." });
  }

  try {
    const query = "INSERT INTO albums (title, cover_url) VALUES (?, ?)";
    const [result] = await db.execute(query, [title, coverUrl]);
    res.status(201).json({ message: "Album created successfully", album_id: result.insertId });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to create album" });
  }
});

// API to Add Music to Album
app.post("/add-music", upload.fields([{ name: "file" }, { name: "cover" }]), async (req, res) => {
  const { album_id, title, type } = req.body;
  const file = req.files["file"]?.[0];
  const cover = req.files["cover"]?.[0];

  if (!album_id || !title || !file) {
    return res.status(400).json({ message: "Album ID, title, and music file are required." });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  const coverUrl = cover
    ? `${req.protocol}://${req.get("host")}/uploads/${cover.filename}`
    : null;

  try {
    const query = `
      INSERT INTO albummusic (album_id, title, type, file_url, cover_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(query, [album_id, title, type, fileUrl, coverUrl]);
    res.status(201).json({ message: "Music added to album successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to add music to album" });
  }
});

// API to Fetch Albums with Their Music
app.get("/albums", async (req, res) => {
  try {
    const [albums] = await db.query(`
      SELECT a.album_id, a.title AS album_title, a.cover_url AS album_cover, m.music_id, 
             m.title AS music_title, m.type, m.file_url, m.cover_url AS music_cover
      FROM albums a
      LEFT JOIN albummusic m ON a.album_id = m.album_id
      ORDER BY a.created_at DESC
    `);

    const groupedAlbums = albums.reduce((acc, item) => {
      const album = acc.find((a) => a.album_id === item.album_id);
      if (album) {
        album.tracks.push({
          music_id: item.music_id,
          title: item.music_title,
          type: item.type,
          file_url: item.file_url,
          cover: item.music_cover,
        });
      } else {
        acc.push({
          album_id: item.album_id,
          title: item.album_title,
          cover: item.album_cover,
          tracks: item.music_id
            ? [
                {
                  music_id: item.music_id,
                  title: item.music_title,
                  type: item.type,
                  file_url: item.file_url,
                  cover: item.music_cover,
                },
              ]
            : [],
        });
      }
      return acc;
    }, []);

    res.status(200).json(groupedAlbums);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch albums" });
  }
});

// Start the server on port 3001
app.listen(3000,"0.0.0.0", () => {
  console.log("Server is running on http://192.168.10.3:3000");
});
