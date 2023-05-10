import { MongoServerError } from "mongodb";

export const signUpErrors = (err: MongoServerError) => {
  let errors = { pseudoEn: "",pseudoFr:"", emailEn: "",emailFr: "", passwordEn: "",passwordFr: "" };

  if (err.message.includes("pseudo")) {
    errors.pseudoEn = "Incorrect pseudo. please try again.";
    errors.pseudoFr = "Pseudo incorrect. Veuillez réessayer.";
  }

  if (err.message.includes("email")) {
    errors.emailEn = "Incorrect Email. please try again.";
    errors.emailFr = "Email incorrect. Veuillez réessayer.";
  }

  if (err.message.includes("password")) {
    errors.passwordEn = "Password should contain at least 6 characters";
    errors.passwordFr = "Le mot de passe doit contenir au moins 6 caractères";
  }

  if (
    err.code === 11000 &&
    Object.keys(err["keyValue"])[0].includes("pseudo")
  ) {
    errors.pseudoEn = "This pseudo is already used.";
    errors.pseudoFr = "Ce pseudo est déjà utilisé.";
  }

  if (err.code === 11000 && Object.keys(err["keyValue"])[0].includes("email")) {
    errors.emailEn = "This e-mail is already used.";
    errors.emailFr = "Cet e-mail est déjà utilisé.";
  }

  return errors;
};

export const loginErrors = (err: Error) => {
  let errors = { emailEn: "",emailFr: "", passwordEn: "", passwordFr: "" };
  if (err.message.includes("Email")) {
    errors.emailEn = "Invalid Email.";
    errors.emailFr = "Email invalide.";
  }

  if (err.message.includes("password")) {
    errors.passwordEn = "Invalid Credentials.";
    errors.passwordFr = "Identifiants ou Mot de passe invalides.";
  }
  return errors;
};

export const addFriendErrors = (err: Error) => {
  let errors = { friend: "" };
  if (err.message.includes("already")) {
    errors.friend = "This user is already your friend.";
  }
  if (err.message.includes("does not exist")) {
    errors.friend = "This user does not exist.";
  }

  return errors;
}

export const removeFriendErrors = (err: Error) => {
  let errors = { friend: "" };
  if (err.message.includes("does not exist")) {
    errors.friend = "This user does not exist.";
  }
  if (err.message.includes("not your friend")) {
    errors.friend = "This user is not your friend.";
  }

  return errors;
}

export const getFriendsErrors = (err: Error) => {
  let errors = { friends: "" };
  if (err.message.includes("does not exist")) {
    errors.friends = "This user does not exist.";
  }

  return errors;
}
