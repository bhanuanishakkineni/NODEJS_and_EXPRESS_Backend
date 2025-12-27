import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;

    // Check if movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    });

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    // Check if movie is already in watchlist
    const existingWatchList = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId,
            },
        },
    });

    if (existingWatchList) {
        return res.status(400).json({ error: "Movie already in watchlist" });
    }

    // Add movie to watchlist
    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        }
    });
    res.status(201).json({
        status: "success",
        data: { watchlistItem }
    });
};

const updateWatchList = async (req, res) => {
    const { id } = req.params;
    const { status, rating, notes } = req.body;

    const watchListItem = await prisma.watchlistItem.findUnique({
        where: { id: id }
    });

    if (!watchListItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    if (watchListItem.userId !== req.user.id) {
        return res.status(403).json({error: "Not authorized to update this item" });
    }

    const updatedItem = {};
    if (status) updatedItem.status = status;
    if (rating) updatedItem.rating = rating;
    if (notes) updatedItem.notes = notes;

    await prisma.watchlistItem.update({
        where: { id: id },
        data: updatedItem
    });

    res.status(200).json({
        status: "success",
        data: {
            watchlistItem: updatedItem
        }
    });
};

const deleteFromWatchList = async (req, res) => {
    const { id } = req.params;

    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: id }
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    if (watchlistItem.userId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized to delete this item" });
    }

    await prisma.watchlistItem.delete({
        where: { id: id }
    });
    res.status(201).json({
        status: "success",
        message: "Watchlist item deleted successfully"
    });
}

export { addToWatchList, deleteFromWatchList, updateWatchList };