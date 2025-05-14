package com.example.backend.repositories;

import com.example.backend.models.Credential;
import com.example.backend.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CredentialRepository extends JpaRepository<Credential, Long> {


    Credential findByUtilisateur(Utilisateur utilisateur);
}
