import mysql from 'mysql';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const mobileNumber = req.body.mobile_number;
        const numberPattern = /^\d{10}$/;

        if (numberPattern.test(mobileNumber)) {
            const db = mysql.createConnection({
                host: 'localhost',       // Replace with your database host
                user: 'root',            // Replace with your database username
                password: '12345678',    // Replace with your database password
                database: 'yourdatabase' // Replace with your database name
            });

            db.connect(err => {
                if (err) {
                    res.status(500).send('Error connecting to MySQL.');
                    return;
                }

                db.query("SELECT * FROM mobile_numbers WHERE number = ?", [mobileNumber], (err, results) => {
                    if (err) {
                        res.status(500).send('Error checking the number.');
                        return;
                    }

                    if (results.length > 0) {
                        res.send('This number has already been shared.');
                    } else {
                        db.query("INSERT INTO mobile_numbers (number) VALUES (?)", [mobileNumber], (err) => {
                            if (err) {
                                res.status(500).send('Error storing the number.');
                                return;
                            }
                            res.send('Thank you! I’m really happy you shared your number with me. 😊');
                        });
                    }
                });
            });
        } else {
            res.send('Please enter a valid 10-digit mobile number.');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
