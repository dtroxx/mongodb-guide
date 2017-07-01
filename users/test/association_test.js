const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Assocations', () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on great post' });

    //To associate a user with a blog post
    joe.blogPosts.push(blogPost);
   // associate a blogPost with a comment
    blogPost.comments.push(comment);
    // associate a comment to a user
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done());
  });

  it('save a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts') // load blogPosts
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great')
        done();
      })
  });

  it('saves a full relation tree', (done) => {
    User.findOne({ name: 'Joe' }) // find user
      .populate({
        path: 'blogPosts', // load all associated blogPosts for user
        populate: { // inside blogPosts that you just found populate the comments
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then((user) => {
        //console.log(user.blogPosts[0].comments[0]);
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');

        done();
      })
  });

});
