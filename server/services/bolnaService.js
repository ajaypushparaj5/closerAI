const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

async function makeCall({ phoneNumber, userProfile }) {
    if (!process.env.BOLNA_API_KEY || !process.env.BOLNA_AGENT_ID) {
        throw new Error("Missing BOLNA_API_KEY or BOLNA_AGENT_ID in environment variables");
    }

    const payload = {
        agent_id: process.env.BOLNA_AGENT_ID,
        recipient_phone_number: phoneNumber,
    };

    if (userProfile) {
        payload.user_data = {
            pricing: userProfile.pricing,
            services: userProfile.services,
            delivery_time: userProfile.deliveryTime,
            tone: userProfile.tone
        };
    }

    try {
        const response = await fetch("https://api.bolna.ai/call", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.BOLNA_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Bolna API error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling Bolna API:", error);
        throw error;
    }
}

async function getCallStatus(executionId) {
    if (!process.env.BOLNA_API_KEY) {
        throw new Error("Missing BOLNA_API_KEY in environment variables");
    }

    try {
        const response = await fetch(`https://api.bolna.ai/executions/${executionId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.BOLNA_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Bolna API error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching Bolna call status:", error);
        throw error;
    }
}

module.exports = { makeCall, getCallStatus };
