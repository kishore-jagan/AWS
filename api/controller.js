const { error } = require('console');
const { pool } = require('./db');

const getEcfsData = async (req, res) => {
    try {
        // console.log("Querying database ecfs...");
        const ecfsresult = await pool.query('SELECT * FROM ecfs_data');
        res.json(ecfsresult.rows);
    } catch (err){
        console.error('Error fetching ecfs data:', err);
        res.status(500).json({error: 'Failed to fetch ecfs data' })
    }
};

const getAwsData = async (req, res) => {
    try{
    //    console.log("Querying databse aws...");
       const awsresult = await pool.query('SELECT * FROM aws_data');
       res.json(awsresult.rows);
    } catch (err){
        console.error('Error fetching data aws:', err);
        res.status(500).json({error: 'Failed to fetch aws data'})
    }
};

    // const getSensors = async (req, res) => {
    //     try {
    //         console.log("Querying database reports and analytics...");
    //         const ecfsresult = await pool.query('SELECT * FROM ecfs_data');
    //         const awsresult = await pool.query('SELECT * FROM aws_data');
    //         res.json({
    //             ecfs: ecfsresult.rows,
    //             aws: awsresult.rows
    //         });
    //     } catch (err){
    //         console.error('Error fetching ecfs and aws data:', err);
    //         res.status(500).json({error: 'Failed to fetch ecfs and aws data' })
    //     }
    // };

    const getSensors = async (req, res) => {
            const { fromDate, toDate } = req.query;
            
            if (!fromDate || !toDate) {
                return res.status(400).json({ error: 'Missing fromDate or toDate' });
            }

            try {

            console.log('Received fromDate:', fromDate);
            console.log('Received toDate:', toDate);
    
            // Convert to local time if necessary
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);
    
            console.log('Parsed fromDate (UTC):', fromDateObj.toISOString());
            console.log('Parsed toDate (UTC):', toDateObj.toISOString());
    
            const ecfsQuery = `
                SELECT * FROM ecfs_data 
                WHERE "timestamp" BETWEEN $1 AND $2
            `;
            const awsQuery = `
                SELECT * FROM aws_data 
                WHERE "timestamp" BETWEEN $1 AND $2
            `;

            const ecfsresult = await pool.query(ecfsQuery, [fromDateObj, toDateObj]);
            const awsresult = await pool.query(awsQuery, [fromDateObj, toDateObj]);
    
            res.json({
                ecfs: ecfsresult.rows,
                aws: awsresult.rows
            });
        } catch (err) {
            console.error('Error fetching ecfs and aws data:', err);
            res.status(500).json({ error: 'Failed to fetch ecfs and aws data' });
        }
    };
    

module.exports = {
    getEcfsData,
    getAwsData,
    getSensors,
}