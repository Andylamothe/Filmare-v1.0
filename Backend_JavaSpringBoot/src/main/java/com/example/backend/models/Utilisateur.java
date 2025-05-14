package com.example.backend.models;

import jakarta.persistence.*;

import java.sql.Blob;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bio;
    private String name;
    private String lastName;
    private String username;
    @Lob()
    private Blob profilepicture;





    private transient String password;
    private transient String email;


    public Utilisateur(String username, String email, String password){
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public Utilisateur() {

    }
    public Blob getProfilepicture() {
        return profilepicture;
    }

    public void setProfilepicture(Blob blob) {
        this.profilepicture = blob;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
