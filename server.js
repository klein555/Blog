require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
const port = 3000;

// --- Middleware ---
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// ------------------


// --- ডাটাবেস সংযোগ স্থাপন ---
const dbURI = process.env.DB_URI;
 // দয়া করে লিঙ্কটি পরিবর্তন করে নিন
mongoose.connect(dbURI)
  .then((result) => {
    console.log('MongoDB সফলভাবে সংযুক্ত হয়েছে।');
    app.listen(port, () => {
      console.log(`সার্ভারটি http://localhost:${port} -এ সফলভাবে চালু হয়েছে।`);
    });
  })
  .catch((err) => console.log(err));
// -------------------------


// --- Routes ---

// 1. হোমপেজ: সব পোস্ট দেখানো
app.get('/', (req, res) => {
  Post.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { posts: result, title: 'আমার ব্লগ' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 2. নতুন পোস্ট তৈরির ফর্ম দেখানো (এই রুটটি :id এর আগে থাকতে হবে)
app.get('/posts/new', (req, res) => {
  res.render('new-post', { title: 'নতুন পোস্ট' });
});

// 3. একটি নির্দিষ্ট পোস্টের বিস্তারিত দেখানো (এই রুটটি 'new' এর পরে থাকবে)
app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id)
      .then(result => {
        res.render('details', { post: result, title: 'পোস্টের বিস্তারিত' });
      })
      .catch(err => {
          // যদি ID খুঁজে না পাওয়া যায় বা অন্য কোনো এরর হয়
          console.log(err);
          res.status(404).send('দুঃখিত, পোস্টটি খুঁজে পাওয়া যায়নি।');
      });
  });

// 4. নতুন পোস্ট ডাটাবেসে সেভ করা
app.post('/posts', (req, res) => {
  const post = new Post(req.body);
  
  post.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
});
