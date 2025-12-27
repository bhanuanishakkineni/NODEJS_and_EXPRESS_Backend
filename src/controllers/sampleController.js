const sampleFunc = async (req, res) => {
    const { message, sender } = req.body;
    console.log("Request body " + JSON.stringify(req.body));
    console.log("Sample request is " + message + " from " + sender);
    console.log("request method is " + req.method);
    res.json({ message: "Inside sample route" });
}

export { sampleFunc };