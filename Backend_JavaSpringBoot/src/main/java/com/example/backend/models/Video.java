package com.example.backend.models;

import jakarta.persistence.*;


@Entity
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String link;
    private float rating;
    private int views;
    private String category;
    @ManyToOne
    @JoinColumn(name = "id_MadeBy")
    private Utilisateur creator;
    private String description;

    public Video(int id, String title, String link, float rating, int views, String category, Utilisateur creator, String description) {

        this.title = title;
        this.link = link;
        this.rating = rating;
        this.views = views;
        this.category = category;
        this.creator = creator;
        this.description = description;
    }

    public Video() {

    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public Utilisateur getCreator() {
        return creator;
    }

    public void setCreator(Utilisateur creator) {
        this.creator = creator;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
