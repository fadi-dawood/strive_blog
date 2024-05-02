import jwt from "jsonwebtoken";
import Author from "../models/authors.model.js"

// generare il token
export const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};


//verificare il token
export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
};


// Middleware da utilizzare nelle richieste che necessitano l'autorizzazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Non è stato fornito il token nell'header
    if (!req.headers.authorization) {
      // Richiedi il login
      res.status(400).send("Effettua il login");
    } else {
      // Ci è stato fornito il token nell'header
      
      // Andiamo a togliere la stringa "Bearer " dal token fornito nell'header e verifichiamo il token attraverso la funzione verifyJWT
      const decoded = await verifyJWT(
        req.headers.authorization.replace("Bearer ", "")
      );
      // Il token esiste? Verificamo attraverso la sua proprietà exp
      if (decoded.exp) {
        // Andiamo ad eliminare dall'oggetto decoded issuedAt e expiredAt
        delete decoded.iat;
        delete decoded.exp;
        
        // Andiamo a trovare l'utente con i dati del payload(ID)
        console.log(decoded)
        const me = await Author.findOne({
          ...decoded,
        });

        // Utente trovato
        if (me) {
          // Aggiungiamo il parametro user all'oggetto request. req.user avrà tutti i dati dell'utente direttamente dal database
          req.user = me;
          next();
        } else {
          // Utente non trovato
          res.status(401).send("Utente non trovato");
        }
      } else {
        // Token non valido
        res.status(401).send("Rieffettua il login");
      }
    }
  } catch (err) {
    next(err);
  }
};