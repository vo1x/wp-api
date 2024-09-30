import Express, { Request, Response } from "express";
import { createDraft } from "../controllers/draftController";

const router = Express.Router();

router.post("/createDraft", async (req: Request, res: Response) => {
  const { title, content, imageFileName, imageUrl } = req.body;
  let newDraft: any | null = null;
  if (!imageFileName || !imageUrl) {
    newDraft = await createDraft(title, content);
  } else {
    newDraft = await createDraft(title, content, imageFileName, imageUrl);
  }

  if (!newDraft) {
    res
      .status(500)
      .json({ success: false, message: "Error creating draft", newDraft: {} });
  } else {
    res.status(200).json({
      success: false,
      message: "Draft created successfully!",
      newDraft: newDraft,
    });
  }
});

export default router;
