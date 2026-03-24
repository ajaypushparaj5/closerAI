const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const bolnaService = require('./services/bolnaService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory store (replace with DB in production)
let callResults = [];

// POST /api/call-result — store a call result from Bolna webhook
app.post('/api/call-result', (req, res) => {
    const {
        client_name,
        interest_level,
        objection_type,
        final_status,
        budget_signal,
        notes,
    } = req.body;

    // Validate required fields
    if (interest_level === undefined || !final_status) {
        return res.status(400).json({
            error: 'Missing required fields: interest_level, final_status',
        });
    }

    const record = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        client_name: client_name || null,
        interest_level: Math.max(0, Math.min(10, Number(interest_level))),
        objection_type: objection_type || 'None',
        final_status: ['Closed', 'Follow-up', 'Lost'].includes(final_status) ? final_status : 'Follow-up',
        budget_signal: budget_signal || 'Unknown',
        notes: notes || null,
        transcript: req.body.transcript || null,
        extracted_data: req.body.extracted_data || null,
        call_status: req.body.call_status || null,
    };

    callResults.unshift(record);
    console.log(`[${new Date().toISOString()}] New call result stored: ${record.id} — ${record.final_status}`);

    return res.status(201).json({ success: true, id: record.id, record });
});

// POST /api/start-call — initiate an outbound call via Bolna
app.post('/api/start-call', async (req, res) => {
    const { phoneNumber, userProfile } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Missing required field: phoneNumber' });
    }

    try {
        const result = await bolnaService.makeCall({ phoneNumber, userProfile });
        console.log(`[${new Date().toISOString()}] Outbound call initiated to ${phoneNumber}: execution ${result.execution_id}`);
        return res.status(200).json({
            success: true,
            execution_id: result.execution_id,
            status: result.status
        });
    } catch (error) {
        console.error('Failed to start call:', error.message);
        // Extract inner JSON if possible to get a cleaner message
        let userMessage = error.message;
        if (error.message.includes('{')) {
            try {
                const parsed = JSON.parse(error.message.substring(error.message.indexOf('{')));
                if (parsed.message) userMessage = parsed.message;
            } catch (e) { }
        }
        return res.status(500).json({ error: userMessage });
    }
});

// GET /api/call-status/:execution_id — fetch call status from Bolna
app.get('/api/call-status/:execution_id', async (req, res) => {
    const { execution_id } = req.params;

    if (!execution_id) {
        return res.status(400).json({ error: 'Missing execution_id' });
    }

    try {
        const result = await bolnaService.getCallStatus(execution_id);
        return res.status(200).json({
            success: true,
            status: result.status,
            transcript: result.transcript,
            extracted_data: result.extracted_data
        });
    } catch (error) {
        console.error(`Failed to get status for ${execution_id}:`, error.message);
        return res.status(500).json({ error: 'Failed to fetch call status', details: error.message });
    }
});

// GET /api/results — fetch all call results
app.get('/api/results', (req, res) => {
    const { status, limit } = req.query;

    let results = [...callResults];

    if (status && ['Closed', 'Follow-up', 'Lost'].includes(status)) {
        results = results.filter((r) => r.final_status === status);
    }

    if (limit) {
        results = results.slice(0, Math.min(parseInt(limit), 100));
    }

    return res.json(results);
});

// GET /api/results/:id — fetch a single result
app.get('/api/results/:id', (req, res) => {
    const result = callResults.find((r) => r.id === req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    return res.json(result);
});

// DELETE /api/results/:id — delete a result
app.delete('/api/results/:id', (req, res) => {
    const before = callResults.length;
    callResults = callResults.filter((r) => r.id !== req.params.id);
    if (callResults.length === before) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', results: callResults.length, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`CloserAI backend running on http://localhost:${PORT}`);
    console.log(`  POST http://localhost:${PORT}/api/call-result`);
    console.log(`  GET  http://localhost:${PORT}/api/results`);
});
