package com.example.backend.repositories;

import com.example.backend.models.Utilisateur;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Utilisateur findAllByUsername(String username);


    Utilisateur findUtilisateurByUsername(String username);
}
