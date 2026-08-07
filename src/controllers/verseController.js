const verseService = require('../services/verseService');

exports.getToday = async (req, res) => {
    try {
        const verse = await verseService.getDailyContent();
        res.status(200).json({
            success: true,
            data:verse
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message }); 
    }    
};

exports.postVerse = async (req, res) => {
    try {
        const result = await verseService.addVerse(req.body);
        res.status(201).json({
            success: true,
            data: { id: result },
            message: "Verset programmé avec succès !"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};