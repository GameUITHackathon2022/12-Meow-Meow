const token = "KjMCjAPUPfLtkjOfhwOzGgXofxKFnfPT"
const response = {
    status: "success",
    data: {
        token: token
    }
}
export default function handler(req, res) {
  if (req.method === "POST") {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=180000');
    res.end(JSON.stringify(response));
  } else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=180000');
    res.end(JSON.stringify(response));
  }
}
