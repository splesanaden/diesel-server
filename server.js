import express from "express";
import cors from "cors";
import inventoryRouter from "./routes/inventoryRouter.js";
import hangarRouter from "./routes/hangarRouter.js";
import squadronRouter from "./routes/squadronRouter.js";
import shopRouter from "./routes/shopRouter.js";
import playerRouter from "./routes/playerRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use the imported routes
app.use("/inventory", inventoryRouter);
app.use("/hangar", hangarRouter);
app.use("/squadron", squadronRouter);
app.use("/shop", shopRouter);
app.use("/player", playerRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
