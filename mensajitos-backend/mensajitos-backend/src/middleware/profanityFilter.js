const profanityList = ['palabra1', 'palabra2', 'palabra3']; // Añade aquí las palabras que quieres filtrar

const profanityFilter = (req, res, next) => {
  if (req.body.content) {
    const words = req.body.content.split(' ');
    const filteredWords = words.map(word => 
      profanityList.includes(word.toLowerCase()) ? '*'.repeat(word.length) : word
    );
    req.body.content = filteredWords.join(' ');
  }
  next();
};

module.exports = profanityFilter;
