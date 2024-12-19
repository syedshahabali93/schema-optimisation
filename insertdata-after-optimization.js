const { MongoClient } = require("mongodb");
const { faker } = require('@faker-js/faker'); // For generating random fake data

const MONGO_URL = "mongodb://localhost:27017";  // MongoDB connection URL
const DB_NAME = "optimized_db";  // Database name
const USERS_COLLECTION = "users";
const BLOGS_COLLECTION = "blogs";

// Generate random users
const generateUsers = (numUsers) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    users.push({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      joinedDate: faker.date.past(),
    });
  }
  return users;
};

// Generate random blogs with embedded comments
const generateBlogs = (numBlogs, users) => {
  const blogs = [];
  for (let i = 0; i < numBlogs; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const comments = generateComments(3);  // Each blog will have 3 comments

    blogs.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      author: user.name,  // Embed user name as author
      userId: user._id,  // Embed userId (referencing the user)
      createdDate: faker.date.past(),
      comments: comments,  // Embed comments directly into the blog
    });
  }
  return blogs;
};

// Generate random comments
const generateComments = (numComments) => {
  const comments = [];
  for (let i = 0; i < numComments; i++) {
    comments.push({
      userName: faker.internet.username,
      content: faker.lorem.sentence(),
      datePosted: faker.date.past(),
    });
  }
  return comments;
};

// Insert data into MongoDB
async function insertData() {
  const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Generate and insert users
    const users = generateUsers(100000);  // Generate 100 users
    const usersResult = await db.collection(USERS_COLLECTION).insertMany(users);
    console.log(`${usersResult.insertedCount} users inserted.`);

    // Generate and insert blogs with embedded comments
    const blogs = generateBlogs(100000, users);  // Generate 100 blogs
    const blogsResult = await db.collection(BLOGS_COLLECTION).insertMany(blogs);
    console.log(`${blogsResult.insertedCount} blogs inserted.`);

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.close();
  }
}

// Run the script
insertData().catch((err) => console.error("Error in insertData function:", err));
