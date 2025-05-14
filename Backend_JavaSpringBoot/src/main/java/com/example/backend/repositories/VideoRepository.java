package com.example.backend.repositories;

import com.example.backend.models.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {

    ArrayList<Video> findAllById(int id);

    ArrayList<Video> findAllByTitle(String title);

    // Nouvelle méthode pour rechercher par titre (insensible à la casse)
    List<Video> findAllByTitleContainingIgnoreCase(String title);

    // Méthode pour trouver toutes les vidéos d'un créateur
    List<Video> findAllByCreator_Id(Long creatorId);

    List<Video> findVideosByCategory(String category);
}
