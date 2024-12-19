const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; // MongoDB is running locally
const client = new MongoClient(url);
const dbName = "testDB";

async function constrainedEnvironmentQuery() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const blogsCollection = db.collection('blogs');

        // Start time before running the query
        const start = Date.now();

        // Aggregation pipeline
        const pipeline = [
            // Lookup comments for each blog
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'blog_id',
                    as: 'blog_comments',
                },
            },
            // Flatten the comments array to increase intermediate document count
            {
                $unwind: '$blog_comments',
            },
            // Add a default conversion for invalid strings
            {
                $addFields: {
                    numericSubstring: {
                        $convert: {
                            input: { $substr: ['$blog_comments.content', 0, 2] },
                            to: 'int',
                            onError: 0, // Default value for invalid conversions
                            onNull: 0,  // Default value for null inputs
                        },
                    },
                },
            },
            // Group by blog ID to calculate total comments and random stats
            {
                $group: {
                    _id: '$_id',
                    totalComments: { $sum: 1 },
                    randomStat: { $avg: '$numericSubstring' },
                    blogTitle: { $first: '$title' },
                },
            },
            // Sort by total comments without an index
            {
                $sort: { totalComments: -1 },
            },
            // Add more processing to increase memory usage
            {
                $project: {
                    blogTitle: 1,
                    totalComments: 1,
                    randomStat: 1,
                    extraProcessing: { $concat: ['Title: ', '$blogTitle'] },
                },
            },
            // Limit results
            {
                $limit: 10,
            },
        ];

        console.log('Running aggregation...');
        const result = await blogsCollection.aggregate(pipeline).toArray();

        // End time after running the query
        const end = Date.now();

        // Log the execution time and result count
        console.log('Query executed successfully:', result.length);
        console.log('Time taken:', end - start, 'ms');
    } catch (error) {
        console.error('Error during query execution:', error);
    } finally {
        await client.close();
    }
}

constrainedEnvironmentQuery().catch(console.error);


// async function slowQuery() {
//     const url = 'mongodb://localhost:27017';  // MongoDB is running locally
//     const client = new MongoClient(url);
//     try {

//         await client.connect();
//         console.log('Connected to MongoDB');

//         const db = client.db('testDB');
//         const usersCollection = db.collection('users');
//         const blogsCollection = db.collection('blogs');
//         const commentsCollection = db.collection('comments');

//         // Aggregation to demonstrate slowness
//         const pipeline = [
//             // Join blogs with comments
//             {
//                 $lookup: {
//                     from: 'comments',
//                     localField: '_id',
//                     foreignField: 'blog_id',
//                     as: 'blog_comments',
//                 },
//             },
//             // Flatten the blog_comments array
//             {
//                 $unwind: '$blog_comments',
//             },
//             // Join users with the comments
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'blog_comments.user_id',
//                     foreignField: '_id',
//                     as: 'commenting_user',
//                 },
//             },
//             // Flatten the commenting_user array
//             {
//                 $unwind: '$commenting_user',
//             },
//             // Filter blogs with specific conditions (simulate complexity)
//             {
//                 $match: {
//                     'commenting_user.username': { $regex: /^user[1-5]/ }, // Match only specific users
//                     'blog_comments.content': { $regex: /comment number (999|1000)/ }, // Match specific comments
//                 },
//             },
//             // Project specific fields
//             {
//                 $project: {
//                     blog_title: '$title',
//                     comment: '$blog_comments.content',
//                     commenter: '$commenting_user.username',
//                     comment_date: '$blog_comments.createdAt',
//                 },
//             },
//             // Sort by comment date
//             {
//                 $sort: { comment_date: -1 }, // Sorting without index
//             },
//             // Limit results to demonstrate pagination
//             {
//                 $limit: 20,
//             },
//         ];

//         const result = await blogsCollection.aggregate(pipeline).toArray();
//         console.log('Query result:', result);
//     } catch (error) {
//         console.error('Error during query execution:', error);
//     } finally {
//         await client.close();
//     }
// }

// slowQuery().catch(console.error);
