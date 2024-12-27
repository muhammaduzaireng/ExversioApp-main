const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const stripe = Stripe('pk_live_51QAsW0JWonOOC6wojMwqo0uHlTfAr7dRwGKTV2rr48yy6EZniU8d3ML5IuKkihfD2ukZFX40TOUK1sRjpzDqa37d00Ncul3Dsr');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Enable body-parser to handle JSON requests
const https = require('https');

// MySQL Connection
// const db = mysql.createConnection({
//   host: '192.168.10.3',
//   user: 'root',
//   password: '1234',
//   database: 'project_db',
// });
const db = mysql.createPool({
  host: "srv1134.hstgr.io",
  user: "u518897449_exversioMusic",
  password: "Exversio1234",
  database: "u518897449_exversioMusic",
  port: 3306,
  connectTimeout: 10000,
  // Enable debug mode
});

const uploadDir = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for general uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Configure multer specifically for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const profilePictureDir = path.join(uploadDir, 'profile-pictures');
    if (!fs.existsSync(profilePictureDir)) {
      fs.mkdirSync(profilePictureDir, { recursive: true });
    }
    cb(null, profilePictureDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const profilePictureUpload = multer({ storage: profilePictureStorage });

// Serve Static Files
app.use('/uploads', express.static(uploadDir));

module.exports = { upload, profilePictureUpload };

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
app.post('/Signup', async (req, res) => {
  const { name, email, username, password, country } = req.body;

  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save the user data along with OTP in the users table
  const userQuery = 'INSERT INTO users (name, email, username, password, country, otp) VALUES (?, ?, ?, ?, ?, ?)';

  try {
    const [userResult] = await db.query(userQuery, [name, email, username, password, country, otp]);

    // Get the inserted user's ID
    const userId = userResult.insertId;

    // Automatically insert a record into the profile table for this user
    const profileQuery = 'INSERT INTO profile (user_id, country, created_at) VALUES (?, ?, NOW())';

    try {
      await db.query(profileQuery, [userId, country]);

      // Send OTP via email after successfully creating the user and profile
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP code is: ${otp}`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP sent:', info.response);
        res.status(200).json({
          success: true,
          message: 'User and profile created successfully, OTP sent',
          userId,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
      }
    } catch (profileError) {
      console.error('Error inserting profile:', profileError);
      res.status(500).json({ success: false, message: 'Failed to create profile' });
    }
  } catch (userError) {
    console.error('Error inserting user:', userError);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
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
// app.get('/getUserProfile', (req, res) => {
//     const userId = req.query.userId;  // Get user ID from query params
  
//     const query = `
//       SELECT u.name, u.email, p.profile_picture, p.bio, p.country
//       FROM users u
//       LEFT JOIN profile p ON u.id = p.user_id
//       WHERE u.id = ?
//     `;
  
//     db.query(query, [userId], (err, result) => {
//       if (err) {
//         console.error('Error fetching user profile:', err);
//         return res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
//       }
//       if (result.length > 0) {
//         return res.status(200).json({ success: true, data: result[0] });
//       } else {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
//     });
//   });
// Get user profile
// Get user profile
app.get('/getUserProfile', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  const query = `
    SELECT u.name, u.email, p.profile_picture, p.bio, p.country
    FROM users u
    LEFT JOIN profile p ON u.id = p.user_id
    WHERE u.id = ?
  `;

  try {
    const [result] = await db.query(query, [userId]);

    if (result.length > 0) {
      const profileData = {
        name: result[0].name || '',
        email: result[0].email || '',
        bio: result[0].bio || '',
        country: result[0].country || '',
        profilePicture: result[0].profile_picture || '/uploads/default.jpg', // Default profile picture
      };
      return res.status(200).json({ success: true, data: profileData });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user profile:', err.message, err.stack);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// Update User Profile
app.post('/updateProfile', upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Received profile update request:', req.body);
    console.log('Uploaded profile picture details:', req.file);

    const { userId, name, bio, country } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId || !name) {
      console.error('Error: User ID and Name are required');
      return res.status(400).json({ success: false, message: 'User ID and Name are required' });
    }

    // Update users table
    const updateUserQuery = 'UPDATE users SET name = ? WHERE id = ?';
    console.log('Executing query (updateUserQuery):', updateUserQuery, [name, userId]);

    console.time('updateUserQuery');
    const [updateUserResult] = await db.query(updateUserQuery, [name, userId]);
    console.timeEnd('updateUserQuery');

    console.log('updateUserQuery result:', updateUserResult);
    if (updateUserResult.affectedRows === 0) {
      console.warn('No rows updated in users table. Verify userId exists.');
      return res.status(400).json({ success: false, message: 'No updates were made to the users table.' });
    }

    // Update or insert into profile table
    const updateProfileQuery = `
      INSERT INTO profile (user_id, bio, country, profile_picture)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        bio = VALUES(bio),
        country = VALUES(country),
        profile_picture = COALESCE(VALUES(profile_picture), profile_picture),
        updated_at = NOW()
    `;
    console.log('Executing query (updateProfileQuery):', updateProfileQuery, [userId, bio, country, profilePicture]);

    console.time('updateProfileQuery');
    const [updateProfileResult] = await db.query(updateProfileQuery, [userId, bio, country, profilePicture]);
    console.timeEnd('updateProfileQuery');

    console.log('updateProfileQuery result:', updateProfileResult);

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in /updateProfile:', error.message, error.stack);
    return res.status(500).json({ success: false, message: 'An error occurred while updating the profile.' });
  }
});

app.post('/updateProfilePicture', upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Received profile picture update request:', req.body);
    console.log('Uploaded profile picture details:', req.file);

    const { userId } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId || !profilePicture) {
      console.error('Error: User ID and Profile Picture are required');
      return res.status(400).json({ success: false, message: 'User ID and Profile Picture are required' });
    }

    const updateProfilePictureQuery = `
      UPDATE profile
      SET profile_picture = ?
      WHERE user_id = ?
    `;
    console.log('Executing query (updateProfilePictureQuery):', updateProfilePictureQuery, [profilePicture, userId]);

    const [updateResult] = await db.query(updateProfilePictureQuery, [profilePicture, userId]);

    console.log('updateProfilePictureQuery result:', updateResult);

    if (updateResult.affectedRows === 0) {
      console.warn('No rows updated in profile table. Verify userId exists.');
      return res.status(400).json({ success: false, message: 'Failed to update profile picture. User may not exist.' });
    }

    return res.status(200).json({ success: true, updatedProfilePicture: profilePicture });
  } catch (error) {
    console.error('Error in /updateProfilePicture:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update profile picture.' });
  }
});














  

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
  
  // Google Login with Email Verification Link
  const crypto = require('crypto'); // Ensure crypto is imported

  app.post('/sendVerificationLink', async (req, res) => {
    const { email } = req.body;
  
    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
  
    const saveTokenQuery = 'INSERT INTO email_verification (email, token) VALUES (?, ?)';
  
    try {
      // Save the token in the database
      await db.query(saveTokenQuery, [email, verificationToken]);
  
      // Create the verification link
      const verificationLink = `http://your-frontend-url.com/create-password?token=${verificationToken}`;
      const mailOptions = {
        from: 'chbroo5512@gmail.com',
        to: email,
        subject: 'Verify your account',
        text: `Please click the following link to create your password: ${verificationLink}`,
      };
  
      try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.response);
        res.status(200).json({ success: true, message: 'Verification email sent successfully' });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ success: false, message: 'Failed to send email' });
      }
    } catch (dbError) {
      console.error('Error saving token:', dbError);
      res.status(500).json({ success: false, message: 'Failed to generate verification link' });
    }
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

  //apple payments 
  app.post('/create-apple-pay-session', async (req, res) => {
    try {
      const { amount } = req.body;
  
      // Validate the amount
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
  
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: 'usd',
        payment_method_types: ['card'], // Includes Apple Pay as part of 'card'
      });
  
      // Return the client secret
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

  app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-09-30.acacia'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'eur',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_live_51QAsW0JWonOOC6wojMwqo0uHlTfAr7dRwGKTV2rr48yy6EZniU8d3ML5IuKkihfD2ukZFX40TOUK1sRjpzDqa37d00Ncul3Dsr'
    });
  });
  
  
  
  
  
  
//become Artist
  
// Make sure to use the defined 'connection' object in this route
// Handle the "Become an Artist" request
app.post('/become-artist', async (req, res) => {
  const { name, email, country, trackStack, bio, subscriptionPrice, user_id } = req.body;

  const query = 'INSERT INTO artists_requests (name, email, country, track_stack, bio, subscription_price, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await db.query(query, [name, email, country, trackStack, bio, subscriptionPrice, user_id], (err, result) => {
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

  try {
    // Execute the query
    const [results] = await db.query(query, [user_id]);

    if (results.length > 0) {
      // If a record is found, return it as an artistRequest object
      const artistRequest = {
        name: results[0].name,
        email: results[0].email,
        country: results[0].country,
        trackStack: results[0].trackStack,
        bio: results[0].bio,
        subscriptionPrice: results[0].subscriptionPrice,
        userId: results[0].userId,
      };

      res.status(200).json({ success: true, artistRequest });
    } else {
      // If no record is found
      res.status(404).json({ success: false, message: 'No artist request found for this user' });
    }
  } catch (err) {
    console.error('Error fetching artist request details:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve artist request details' });
  }
});




// Endpoint to create a new post
app.post('/create-post', async (req, res) => {
  const { artistId, content, mediaUrl, mediaType } = req.body;

  // Log received artistId
  console.log("Received artistId for post creation:", artistId);

  try {
    // Check if artistId exists in the approved_artists table
    const query = 'SELECT * FROM approved_artists WHERE artist_id = ?';
    const [results] = await db.query(query, [artistId]);

    if (results.length === 0) {
      console.warn('Create post failed: User is not an approved artist');
      return res.status(403).json({ success: false, message: 'User is not an approved artist' });
    }

    // Proceed with post creation if the artist is approved
    const insertQuery = 'INSERT INTO posts (artist_id, content, media_url, media_type) VALUES (?, ?, ?, ?)';
    const [insertResult] = await db.query(insertQuery, [artistId, content, mediaUrl, mediaType]);

    console.log('Post created successfully with ID:', insertResult.insertId);
    return res.status(201).json({ success: true, message: 'Post created successfully', postId: insertResult.insertId });

  } catch (err) {
    console.error('Error in create-post:', err);
    return res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});





// server.js

// Endpoint to retrieve artist_id based on user_id
app.get('/get-artist-id', async (req, res) => {
  const { userId } = req.query;

  try {
    // Query the database for the artist ID
    const query = 'SELECT artist_id, name, user_id FROM approved_artists WHERE user_id = ?';
    const [results] = await db.query(query, [userId]);

    if (results.length > 0) {
      // If artist ID is found, return it
      console.log('Query results of Get Artist Data:', results);
      return res.json({ success: true, artistId: results[0].artist_id, artistNames: results[0].name });
    } else {
      // If user is not an approved artist, return a specific message
      return res.status(404).json({ success: false, message: 'User is not an approved artist' });
    }
  } catch (err) {
    console.error('Database error in /get-artist-id:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving artist ID' });
  }
});


app.get('/approved-artists', async (req, res) => {
  const query = `
    SELECT 
      approved_artists.artist_id AS id, 
      approved_artists.name, 
      approved_artists.user_id,
      (SELECT profile_picture FROM profile WHERE profile.user_id = approved_artists.user_id LIMIT 1) AS profile_picture
    FROM approved_artists
  `;

  try {
    // Execute the query using async/await
    const [results] = await db.query(query);

    // Return the results as a JSON response
    res.json({ success: true, artists: results });
  } catch (err) {
    console.error('Error fetching approved artists:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch artists' });
  }
});




// Endpoint to get posts for a specific artist

// Get Posts Endpoint
// app.get('/get-posts', async (req, res) => {
//   const artistId = req.query.artistId;
//   const userId = req.query.userId;

//   console.log("Fetching posts for artistId:", artistId);

//   const query = `
//     SELECT 
//         posts.*, 
//         approved_artists.name AS artist_name,
//         (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
//         CASE 
//     WHEN EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) THEN 1
//     ELSE 0
// END AS isLiked,

//         COALESCE(
//             JSON_ARRAYAGG(
//                 JSON_OBJECT(
//                     'id', comments.id, 
//                     'text', comments.comment_text,
//                     'user_id', comments.user_id,
//                     'user_name', users.name,
//                     'created_at', comments.created_at
//                 )
//             ), '[]'
//         ) AS comments
//     FROM posts
//     LEFT JOIN comments ON posts.id = comments.post_id
//     LEFT JOIN users ON comments.user_id = users.id
//     LEFT JOIN approved_artists ON posts.artist_id = approved_artists.artist_id
//     WHERE posts.artist_id = ?
//     GROUP BY posts.id
//     ORDER BY posts.created_at DESC;
//   `;

//   await db.query(query, [userId, artistId], (err, posts) => {
//     if (err) {
//       console.error('Error fetching posts in get-posts:', err);
//       return res.status(500).json({ success: false, message: 'Failed to fetch posts' });
//     }

//     const formattedPosts = posts.map(post => {
//       let parsedComments;
//       try {
//         parsedComments = JSON.parse(post.comments || '[]'); // Safely parse the comments JSON
//         // Sort comments by created_at descending
//         parsedComments = parsedComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       } catch (err) {
//         console.error(`Error parsing comments for post ${post.id}:`, err);
//         parsedComments = []; // Fallback to an empty array on error
//       }

//       return {
//         ...post,
//         isLiked: post.isLiked === 1, // Convert to boolean
//         comments: parsedComments, // Use sorted comments
//         like_count: post.like_count || 0 // Ensure like_count is a valid number
//       };
//     });

//     res.json({ success: true, posts: formattedPosts });
//   });
// });
//updated..
// app.get('/get-posts', async (req, res) => {
//   const { artistId, userId } = req.query;

//   console.log("Query parameters:", req.query); // Log all query parameters
//   console.log("Fetching posts for artistId:", artistId); // Log artistId
//   console.log("Fetching posts for userId:", userId); // Log userId

//   if (!artistId) {
//     return res.status(400).json({ success: false, message: 'artistId is required' });
//   }

//   const query = `
//     SELECT 
//       posts.*, 
//       approved_artists.name AS artist_name,
//       (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
//       CASE 
//         WHEN EXISTS (SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) THEN 1
//         ELSE 0
//       END AS isLiked,
//       COALESCE(
//         JSON_ARRAYAGG(
//           JSON_OBJECT(
//             'id', comments.id, 
//             'text', comments.comment_text,
//             'user_id', comments.user_id,
//             'user_name', users.name,
//             'created_at', comments.created_at
//           )
//         ), '[]'
//       ) AS comments
//     FROM posts
//     LEFT JOIN comments ON posts.id = comments.post_id
//     LEFT JOIN users ON comments.user_id = users.id
//     LEFT JOIN approved_artists ON posts.artist_id = approved_artists.artist_id
//     WHERE posts.artist_id = ?
//     GROUP BY posts.id
//     ORDER BY posts.created_at DESC;
//   `;

//   try {
//     const [posts] = await db.query(query, [userId, artistId]);

//     res.json({ success: true, posts });
//   } catch (err) {
//     console.error('Error fetching posts:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch posts' });
//   }
// });

app.get('/get-posts', async (req, res) => {
  const { artistId, userId } = req.query;

  console.log("Query parameters:", req.query); // Log all query parameters
  console.log("Fetching posts for artistId:", artistId); // Log artistId
  console.log("Fetching posts for userId:", userId); // Log userId

  if (!artistId) {
    return res.status(400).json({ success: false, message: 'artistId is required' });
  }

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
    LEFT JOIN comments ON posts.id = comments.post_id
    LEFT JOIN users ON comments.user_id = users.id
    LEFT JOIN approved_artists ON posts.artist_id = approved_artists.artist_id
    WHERE posts.artist_id = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC;
  `;

  try {
    const [posts] = await db.query(query, [userId, artistId]);

    // Clean up comments: Remove null objects from the aggregated JSON array
    const formattedPosts = posts.map(post => {
      if (post.comments) {
        try {
          const parsedComments = JSON.parse(post.comments).filter(comment => comment !== null);
          post.comments = parsedComments;
        } catch (error) {
          console.error(`Error parsing comments for post ${post.id}:`, error);
          post.comments = [];
        }
      }
      return post;
    });

    res.json({ success: true, posts: formattedPosts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
});

















// Like/Unlike Post Endpoint
// app.post('/like-post', async (req, res) => {
//   const { postId, userId } = req.body;

//   // Check if the user has already liked the post
//   const checkLikeQuery = 'SELECT id FROM likes WHERE post_id = ? AND user_id = ?';
//   await db.query(checkLikeQuery, [postId, userId], (err, likeResults) => {
//     if (err) {
//       console.error('Error checking like status:', err);
//       return res.status(500).json({ success: false, message: 'Failed to like/unlike post' });
//     }

//     if (likeResults.length > 0) {
//       // Unlike the post if already liked
//       const deleteLikeQuery = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
//       db.query(deleteLikeQuery, [postId, userId], (err) => {
//         if (err) {
//           console.error('Error unliking post:', err);
//           return res.status(500).json({ success: false, message: 'Failed to unlike post' });
//         }

//         // Decrement like_count in posts table
//         const decrementLikeQuery = 'UPDATE posts SET like_count = like_count - 1 WHERE id = ?';
//         db.query(decrementLikeQuery, [postId], (err) => {
//           if (err) {
//             console.error('Error decrementing like count:', err);
//             return res.status(500).json({ success: false, message: 'Failed to update like count' });
//           }
//           return res.json({ success: true, message: 'Post unliked successfully' });
//         });
//       });
//     } else {
//       // Like the post if not already liked
//       const insertLikeQuery = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
//       db.query(insertLikeQuery, [postId, userId], (err) => {
//         if (err) {
//           console.error('Error liking post:', err);
//           return res.status(500).json({ success: false, message: 'Failed to like post' });
//         }

//         // Increment like_count in posts table
//         const incrementLikeQuery = 'UPDATE posts SET like_count = like_count + 1 WHERE id = ?';
//         db.query(incrementLikeQuery, [postId], (err) => {
//           if (err) {
//             console.error('Error incrementing like count:', err);
//             return res.status(500).json({ success: false, message: 'Failed to update like count' });
//           }
//           return res.json({ success: true, message: 'Post liked successfully' });
//         });
//       });
//     }
//   });
// });
app.post('/like-post', async (req, res) => {
  const { postId, userId } = req.body;

  // Check if the user has already liked the post
  const checkLikeQuery = 'SELECT id FROM likes WHERE post_id = ? AND user_id = ?';

  try {
    const [likeResults] = await db.query(checkLikeQuery, [postId, userId]);

    if (likeResults.length > 0) {
      // Unlike the post if already liked
      const deleteLikeQuery = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
      await db.query(deleteLikeQuery, [postId, userId]);

      // Decrement like_count in posts table
      const decrementLikeQuery = 'UPDATE posts SET like_count = like_count - 1 WHERE id = ?';
      await db.query(decrementLikeQuery, [postId]);

      return res.json({ success: true, message: 'Post unliked successfully' });
    } else {
      // Like the post if not already liked
      const insertLikeQuery = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
      await db.query(insertLikeQuery, [postId, userId]);

      // Increment like_count in posts table
      const incrementLikeQuery = 'UPDATE posts SET like_count = like_count + 1 WHERE id = ?';
      await db.query(incrementLikeQuery, [postId]);

      return res.json({ success: true, message: 'Post liked successfully' });
    }
  } catch (err) {
    console.error('Error handling like/unlike post:', err);
    return res.status(500).json({ success: false, message: 'Failed to like/unlike post' });
  }
});



// Add Comment Endpoint
// app.post('/add-comment', async (req, res) => {
//   const { postId, userId, commentText } = req.body;

//   const query = `
//     INSERT INTO comments (post_id, user_id, comment_text)
//     VALUES (?, ?, ?)
//   `;

//   await db.query(query, [postId, userId, commentText], (err, result) => {
//     if (err) {
//       console.error('Error adding comment:', err);
//       res.status(500).json({ success: false, message: 'Failed to add comment' });
//     } else {
//       res.json({ success: true, commentId: result.insertId });
//     }
//   });
// });
app.post('/add-comment', async (req, res) => {
  const { postId, userId, commentText } = req.body;

  const query = `
    INSERT INTO comments (post_id, user_id, comment_text)
    VALUES (?, ?, ?)
  `;

  try {
    // Perform the database query using await
    const [result] = await db.query(query, [postId, userId, commentText]);

    // Respond with the new comment ID if the query is successful
    res.status(201).json({ success: true, commentId: result.insertId });
  } catch (err) {
    // Log the error and respond with an error message
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});


app.post('/subscribe', async (req, res) => {
  const { user_id, artist_id } = req.body;

  try {
    // Check if the subscription already exists
    const checkQuery = `
      SELECT * FROM subscriptions WHERE user_id = ? AND artist_id = ?
    `;
    const [results] = await db.query(checkQuery, [user_id, artist_id]);

    if (results.length > 0) {
      // If the subscription already exists, return a message
      return res.json({ success: false, message: 'You already have subscribed to this artist' });
    }

    // If not subscribed, proceed to insert the subscription
    const insertQuery = `
      INSERT INTO subscriptions (user_id, artist_id)
      VALUES (?, ?)
    `;
    const [insertResult] = await db.query(insertQuery, [user_id, artist_id]);

    res.json({ success: true, subscription_id: insertResult.insertId });
  } catch (err) {
    console.error('Database error in subscription:', err);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
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
    -- Fetch profile picture with a condition on user_id dynamically
    (SELECT profile_picture 
     FROM profile 
     WHERE profile.user_id = approved_artists.user_id 
     LIMIT 1) AS artist_profile_picture,
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
        like_count: post.like_count || 0, // Ensure like_count is a valid number
        artist_profile_picture: post.artist_profile_picture || null, // Include the artist's profile picture
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

// API to Create Album
app.post("/create-album", upload.single("cover"), async (req, res) => {
  console.log("Create Album is Called!");
  console.log("Got request to create album");

  const { title, artist_id } = req.body; // Include artist_id from the request body
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : null; // Use relative path

  if (!title) {
    return res.status(400).json({ message: "Album title is required." });
  }

  if (!artist_id) {
    return res.status(400).json({ message: "Artist ID is required." });
  }

  try {
    const query = "INSERT INTO albums (title, cover_url, artist_id) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [title, coverUrl, artist_id]);

    res.status(201).json({
      message: "Album created successfully",
      album_id: result.insertId,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to create album" });
  }
});


// API to Add Music to Album
app.post("/add-music", upload.fields([{ name: "file" }, { name: "cover" }]), async (req, res) => {
  console.log("Add Music is Called!");

  const { album_id, title, type, artist_id } = req.body;
  const file = req.files["file"]?.[0];
  const cover = req.files["cover"]?.[0];

  if (!album_id || !title || !file || !artist_id) {
    return res.status(400).json({ message: "Album ID, title, music file, and artist ID are required." });
  }

  const fileUrl = `/uploads/${file.filename}`; // Use relative path
  const coverUrl = cover ? `/uploads/${cover.filename}` : null;

  try {
    const query = `
      INSERT INTO albummusic (album_id, title, type, file_url, cover_url, artist_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [album_id, title, type, fileUrl, coverUrl, artist_id]);

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
          file_url: `${req.protocol}://${req.get("host")}${item.file_url}`, // Dynamically add base URL
          cover: item.music_cover ? `${req.protocol}://${req.get("host")}${item.music_cover}` : null,
        });
      } else {
        acc.push({
          album_id: item.album_id,
          title: item.album_title,
          cover: item.album_cover ? `${req.protocol}://${req.get("host")}${item.album_cover}` : null,
          tracks: item.music_id
            ? [
                {
                  music_id: item.music_id,
                  title: item.music_title,
                  type: item.type,
                  file_url: `${req.protocol}://${req.get("host")}${item.file_url}`,
                  cover: item.music_cover
                    ? `${req.protocol}://${req.get("host")}${item.music_cover}`
                    : null,
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

// Route to fetch albums and their music by artist_id
app.get("/get-artist-albums", async (req, res) => {
  const { artist_id } = req.query;

  if (!artist_id) {
    return res.status(400).json({ success: false, message: "Artist ID is required." });
  }

  try {
    const [albums] = await db.query(
      `
      SELECT a.album_id, a.title AS album_title, a.cover_url AS album_cover, m.music_id, 
             m.title AS music_title, m.type, m.file_url, m.cover_url AS music_cover
      FROM albums a
      LEFT JOIN albummusic m ON a.album_id = m.album_id
      WHERE a.artist_id = ?
      ORDER BY a.created_at DESC
    `,
      [artist_id]
    );

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

    res.status(200).json({ success: true, albums: groupedAlbums });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch albums" });
  }
});

app.post("/create-playlist", async (req, res) => {
  const { user_id, name } = req.body;

  if (!user_id || !name) {
    return res
      .status(400)
      .json({ success: false, message: "User ID and playlist name are required." });
  }

  try {
    const query = `INSERT INTO fansplaylist (user_id, name) VALUES (?, ?)`;
    await db.execute(query, [user_id, name]);

    res
      .status(201)
      .json({ success: true, message: "Playlist created successfully." });
  } catch (error) {
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create playlist." });
  }
});


app.get("/get-user-playlists", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ success: false, message: "User ID is required." });
  }

  try {
    const [playlists] = await db.query(
      "SELECT  playlist_id, name FROM fansplaylist WHERE user_id = ?",
      [user_id]
    );

    res.status(200).json({ success: true, playlists });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch playlists." });
  }
});


app.post("/add-music-to-playlist", async (req, res) => {
  const { playlist_id, music_id } = req.body;

  if (!playlist_id || !music_id) {
    return res
      .status(400)
      .json({ success: false, message: "Playlist ID and Music ID are required." });
  }

  try {
    await db.query(
      "INSERT INTO playlistmusic (playlist_id, music_id) VALUES (?, ?)",
      [playlist_id, music_id]
    );

    res.status(201).json({ success: true, message: "Music added to playlist successfully." });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Failed to add music to playlist." });
  }
});

app.get("/get-playlist-music", async (req, res) => {
  const { playlist_id } = req.query;

  if (!playlist_id) {
    return res.status(400).json({ success: false, message: "Playlist ID is required." });
  }

  try {
    const query = `
      SELECT pm.music_id, am.title AS music_title, am.file_url, am.cover_url
      FROM playlistmusic pm
      INNER JOIN albummusic am ON pm.music_id = am.music_id
      WHERE pm.playlist_id = ?
    `;
    const [rows] = await db.execute(query, [playlist_id]);

    res.status(200).json({ success: true, music: rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch playlist music." });
  }
});

app.post('/process-payment', async (req, res) => {
  try {
    const { paymentToken } = req.body;

    // Use Stripe's API to process the payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents (10.00 USD)
      currency: 'usd',
      payment_method_data: {
        type: 'card',
        token: paymentToken,
      },
      confirm: true,
    });

    res.status(200).send({ success: true, paymentIntent });
  } catch (error) {
    console.error('Payment failed:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});





// Start the server on port 3001
app.listen(3000,"0.0.0.0", () => {
  console.log("Server is running on https://api.exversio.com");
});
