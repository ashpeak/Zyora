import { Router } from 'express';
import Stripe from '../lib/stripe.js';

const router = Router();

// Checkout route
router.post('/checkout', async (req, res) => {
    const reqBody = await req.body;

    const { email, price } = reqBody;

    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid price value'
        });
    }

    // Convert price to cents and ensure it's an integer
    const amountInCents = Math.round(price * 100);

    try {

        const customer = await Stripe.customers.create(email ? { email } : {});
        const ephemeralKey = await Stripe.ephemeralKeys.create({
            customer: customer.id,
        }, {
            apiVersion: '2025-12-15.clover',
        });

        const paymentIntent = await Stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
            receipt_email: email || undefined,
            description: `Order from ${email || 'Guest User'}`,
            metadata: {
                email: email || 'Guest User',
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Payment intent created successfully',
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Payment processing failed'
        });
    }
});

export default router;