package com.example.backend.exception;

public class UtilisateurNotFoundException extends RuntimeException {

    public UtilisateurNotFoundException(long id){
        super("L'utilisateur n'a pas plus été trouvé avec le id :"+ id);
    }
}
