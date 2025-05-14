package com.example.backend.models;
import jakarta.persistence.*;

@Entity
public class Commentaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Utilisateur creator;

    private String commentsTexte;

    private int likes;

    private int dislikes;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    public Commentaire(Long id, Video video, int dislikes, String commentsTexte, int likes, Utilisateur creator) {


        this.dislikes = dislikes;
        this.commentsTexte = commentsTexte;
        this.likes = likes;
        this.creator = creator;
    }

    public Commentaire() {

    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public Utilisateur getCreator() {
        return creator;
    }

    public void setCreator(Utilisateur creator) {
        this.creator = creator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommentsTexte() {
        return commentsTexte;
    }

    public void setCommentsTexte(String commentsTexte) {
        this.commentsTexte = commentsTexte;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }
}
