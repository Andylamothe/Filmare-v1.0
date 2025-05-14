package com.example.backend.service;

import com.example.backend.models.Credential;
import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.repositories.CredentialRepository;
import com.example.backend.repositories.UtilisateurRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final UtilisateurRepository utilisateurRepository;
    private final CredentialRepository credentialRepository;


    public UtilisateurService(UtilisateurRepository userRepo, CredentialRepository credentialRepository){
        this.utilisateurRepository = userRepo;

        this.credentialRepository = credentialRepository;
    }



    public List<Utilisateur> insertListUtilisateurs(List<Utilisateur> list){
        return utilisateurRepository.saveAll(list);
    }

    public Optional<Utilisateur> userById (long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur getUserByName(String username) {
        return utilisateurRepository.findAllByUsername(username);
    }

    public boolean loginService(String username, String frontEndPWD){
        Utilisateur user = utilisateurRepository.findAllByUsername(username);
        Credential cred  = credentialRepository.findByUtilisateur(user);

        if (user == null) {
            System.out.println("User not found");
            System.out.println(user);
            System.out.println(user.getPassword());

            return false;
        }
        return passwordEncoder.matches(frontEndPWD, cred.getPasswordEncrypt());


    }




}