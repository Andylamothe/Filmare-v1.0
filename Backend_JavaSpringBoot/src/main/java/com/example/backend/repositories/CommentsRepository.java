package com.example.backend.repositories;

import com.example.backend.models.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface CommentsRepository extends JpaRepository<Commentaire, Long> {
    ArrayList<Commentaire> findByVideo_Id(int videoId);
    ArrayList<Commentaire> findByCreatorUsername(String creator);
}
