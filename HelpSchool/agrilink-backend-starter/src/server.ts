import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));

// Products (GET)
app.get('/api/products', async (_, res) => {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  res.json(products);
});

// Orders (POST)
const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    qty: z.number().int().positive(),
    price: z.number().int().nonnegative()
  })),
  pickupPoint: z.string().optional()
});
app.post('/api/orders', async (req, res) => {
  const parse = OrderSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error);

  const token = 'AGR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const order = await prisma.order.create({
    data: {
      token,
      items: { create: parse.data.items.map(i => ({ ...i })) },
    },
    include: { items: true }
  });
  res.status(201).json(order);
});

// Metrics (GET) – simple aggregation
app.get('/api/metrics', async (_, res) => {
  const m = await prisma.metric.findMany({ orderBy: { createdAt: 'desc' }, take: 4 });
  res.json(m);
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log('API listening on ' + port));
