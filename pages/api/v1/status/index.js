function status(request, response) {
  response.status(200).json({ chave: "Alinos do curso.dev são pessoas " });
}
export default status;
