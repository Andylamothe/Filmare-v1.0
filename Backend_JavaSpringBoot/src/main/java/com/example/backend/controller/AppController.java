package com.example.backend.controller;

import com.example.backend.exception.UtilisateurNotFoundException;
import com.example.backend.models.Commentaire;
import com.example.backend.models.Credential;
import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.repositories.UtilisateurRepository;
import com.example.backend.service.AppService;
import com.example.backend.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/userAccess")
@CrossOrigin(origins = "*")
public class AppController {
    @Autowired
    AppService appService;
    @Autowired
    UtilisateurService utilisateurService;


    @GetMapping("/getUtilisateurById/{id}")
    public Utilisateur getUtilisateurById (@PathVariable Long id) {
        return appService.getUtilisateurById(id);
    }

    @GetMapping("/getUtilisateurByUsername/{username}")
    public Utilisateur getUtilisateurByUsername (@PathVariable String username) {
        return appService.getUtilisateurByUsername(username);
    }

    @GetMapping("/getVideosById/{id}")
    public ArrayList<Video> getVideosById (@PathVariable int id) {
        return appService.getVideosById(id);
    }

    @GetMapping("getVideosByLink/{link}")
    public ArrayList<Video> getVideosLink (@PathVariable String link) {
        return appService.getVideosLink(link);
    }

    @GetMapping("getVideosByTitle/{title}")
    public ArrayList<Video> getVideosTitle (@PathVariable String title) {
        return appService.getVideosTitle(title);
    }

    @GetMapping("/getCommentsByVid/{video}")
    public ArrayList<Commentaire> getCommentsByVid (@PathVariable int id) {
        return appService.getCommentsByVid(id);
    }

    @GetMapping("/getCommentsByUser/{user}")
    public ArrayList<Commentaire> getCommentsByUserByUsername (@PathVariable String username_Creator) {
        return appService.getCommentsByUtilisateurs_Username(username_Creator);
    }

    // pour se connecter avec le compte
    // Appel l'utilisateurService
    @PostMapping("/signin")
    public boolean signin(@RequestParam(value = "username") String username, @RequestParam(value = "password") String password){
        return utilisateurService.loginService(username,password);
    }

    //Pour post l'utilisateur et dans le Credential
    @PostMapping("/createAccount")
    public Utilisateur createUser(@RequestBody Utilisateur us){

        System.out.println(us);
        Credential cred = new Credential();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        cred.setEmail(us.getEmail());
        cred.setPasswordEncrypt(passwordEncoder.encode(us.getPassword()));
        cred.setUtilisateur(us);
        appService.saveUser(us);
        appService.saveCredential(cred);
        us.setPassword(null);
        us.setEmail(null);
        return us;
    }

    /// ////////////////////////////////////////////////////////////////


    // changer le put pour le mettre avec username
    @PutMapping("/customer/{id}")
    Utilisateur updateCustomer(@RequestBody Utilisateur newOne, @PathVariable Long id) {

        return utilisateurService.userById(id)
                .map(utilisateur -> {
                    utilisateur.setBio(newOne.getBio());
                    utilisateur.setName(newOne.getName());
                    utilisateur.setLastName(newOne.getLastName());
                    utilisateur.setProfilepicture(newOne.getProfilepicture());
                    return appService.saveUser(utilisateur);

                }).orElseThrow(() -> new UtilisateurNotFoundException(id));

    }



}
