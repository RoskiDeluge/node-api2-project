const express = require('express');
const Posts = require('../data/db.js');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: "The posts information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    !title || !contents 
    ? res.status(400).json({ errorMessage: "Please provide title and content for post"})
    : Posts.insert(req.body)
        .then(() => {
            res.status(201).json(req.body);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                errorMessage: "There was an error while saving the post to the database",
            });
        });
});

router.post('/:id/comments', (req, res) => {
    const { text } = req.body;
    !text ?
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
    : Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(201).json(req.body)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})


module.exports = router;