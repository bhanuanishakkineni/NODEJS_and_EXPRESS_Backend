import { z } from "zod";

const addToWatchListSchema = z.object({
  // movieId: z.string().uuid(),
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
      error: () => ({
        messsage:
          "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot be more than 10")
    .optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),

});

export { addToWatchListSchema };
