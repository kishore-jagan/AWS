const { error } = require('console');
const { pool } = require('./db');
const moment = require('moment/moment');

const getEcfsData = async (req, res) => {
    try {
        // console.log("Querying database ecfs...");
        const ecfsresult = await pool.query('SELECT * FROM ecfs_data_1');
        res.json(ecfsresult.rows);
    } catch (err){
        console.error('Error fetching ecfs data:', err);
        res.status(500).json({error: 'Failed to fetch ecfs data' })
    }
};

const getAwsData = async (req, res) => {
    try{
    //    console.log("Querying databse aws...");
       const awsresult = await pool.query('SELECT * FROM aws_data_2');
       res.json(awsresult.rows);
    } catch (err){
        console.error('Error fetching data aws:', err);
        res.status(500).json({error: 'Failed to fetch aws data'})
    }
};

    // const getSensors = async (req, res) => {
    //     try {
    //         console.log("Querying database reports and analytics...");
    //         const ecfsresult = await pool.query('SELECT * FROM ecfs_data_1');
    //         const awsresult = await pool.query('SELECT * FROM aws_data_2');
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
    
            // Ensure consistent UTC formatting
            const utcDate = moment.utc(fromDate).format("YYYY-MM-DD HH:mm:ss.SSSZ");
            const utcDate2 = moment.utc(toDate).format("YYYY-MM-DD HH:mm:ss.SSSZ");
    
            console.log('Parsed fromDate (UTC):', utcDate);
            console.log('Parsed toDate (UTC):', utcDate2);
    
            const ecfsQuery = `
                SELECT * FROM ecfs_data_1 
                WHERE "timestamp" BETWEEN $1 AND $2
            `;
            const awsQuery = `
                SELECT * FROM aws_data_2 
                WHERE "timestamp" BETWEEN $1 AND $2
            `;
    
            const ecfsresult = await pool.query(ecfsQuery, [utcDate, utcDate2]);
            const awsresult = await pool.query(awsQuery, [utcDate, utcDate2]);
    
            res.json({
                ecfs: ecfsresult.rows,
                aws: awsresult.rows
            });
        } catch (err) {
            console.error('Error fetching ecfs and aws data:', err);
            res.status(500).json({ error: 'Failed to fetch ecfs and aws data' });
        }
    };
    

    const getSensorstest = async (req, res) => {
        try {
            const ecfsQuery = `
                SELECT * FROM ecfs_data_1 
                ORDER BY "timestamp" DESC 
                LIMIT 2000
            `;
            const awsQuery = `
                SELECT * FROM aws_data_2 
                ORDER BY "timestamp" DESC 
                LIMIT 2000
            `;
    
            const ecfsresult = await pool.query(ecfsQuery);
            const awsresult = await pool.query(awsQuery);
    
            res.json({
                ecfs: ecfsresult.rows,
                aws: awsresult.rows
            });
        } catch (err) {
            console.error('Error fetching ecfs and aws data:', err);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    };
    
    

module.exports = {
    getEcfsData,
    getAwsData,
    getSensors,
    getSensorstest
}