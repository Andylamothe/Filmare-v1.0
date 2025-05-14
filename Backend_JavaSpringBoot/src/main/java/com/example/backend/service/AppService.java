package com.example.backend.service;

import com.example.backend.exception.UtilisateurNotFoundException;
import com.example.backend.models.Commentaire;
import com.example.backend.models.Credential;
import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.repositories.CommentsRepository;
import com.example.backend.repositories.CredentialRepository;
import com.example.backend.repositories.UtilisateurRepository;
import com.example.backend.repositories.VideoRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppService {

    UtilisateurRepository userRepo;
    VideoRepository videoRepo;
    CommentsRepository commentsRepo;
    CredentialRepository credRepo;

    // Constructeur avec les Repos en paramètre
    public AppService(UtilisateurRepository repository, VideoRepository videoRepo, CommentsRepository comments, CredentialRepository credRepo){
        this.videoRepo = videoRepo;
        this.credRepo = credRepo;
        this.commentsRepo = comments;
        this.userRepo = repository;
    }

    //Méthode Pour Utilisateur
    public Utilisateur getUtilisateurById ( Long id) {
        return userRepo.findById(id).orElseThrow(() -> new UtilisateurNotFoundException(id));
    }

    public Utilisateur getUtilisateurByUsername (String username) {
        return userRepo.findAllByUsername(username);
    }

    public Utilisateur saveUser(Utilisateur us){
        return userRepo.save(us);
    }





    //Méthode pour Videos
    public ArrayList<Video> getVideosById ( int id) {
        return videoRepo.findAllById(id);
    }

    public ArrayList<Video> getVideosLink (String link) {
        return videoRepo.findAllByTitle(link);
    }

    public ArrayList<Video> getVideosTitle (String title) {
        return videoRepo.findAllByTitle(title);
    }

    public List<Video> insertListVideos(List<Video> list){
        return videoRepo.saveAll(list);
    }


    //Méthode pour comments
    public ArrayList<Commentaire> getCommentsByVid (int id) {
        return commentsRepo.findByVideo_Id(id);
    }

    public ArrayList<Commentaire> getCommentsByUtilisateurs_Username(String username_Creator) {
        return commentsRepo.findByCreatorUsername(username_Creator);
    }

    public List<Commentaire> insertListCommentaire(List<Commentaire> list){
        return commentsRepo.saveAll(list);
    }


    //Méthode pour credentials
    public Credential saveCredential( Credential cred){
        return credRepo.save(cred);
    }
}
