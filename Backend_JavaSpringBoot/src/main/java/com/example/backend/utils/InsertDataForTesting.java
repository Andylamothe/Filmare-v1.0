package com.example.backend.utils;

import com.example.backend.models.Commentaire;
import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.service.AppService;
import com.example.backend.service.UtilisateurService;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Order(1)
public class InsertDataForTesting implements CommandLineRunner {

    @Autowired
    UtilisateurService utilisateurService;
    @Autowired
    AppService videoRepository;

    @Autowired
    AppService comments;



    Faker faker = new Faker();

  //  String fName = faker.name().firstName();
  //  String lName = faker.name().lastName();



    private void insertUsers(){
        List<Utilisateur> list = new ArrayList<>();

        for (int i = 1; i <= 20 ; i++) {
            Utilisateur u = new Utilisateur(faker.pokemon().name()+i, "utilisateur_" + i + "@gmail.com" , "mdpduturfu_" +i );
            u.setName(faker.name().firstName());
            u.setLastName(faker.name().lastName());
            u.setBio(faker.lorem().sentence(10));
            list.add(u);
        }
        utilisateurService.insertListUtilisateurs(list);

    }

    private void inserComments(){
        List<Commentaire> list = new ArrayList<>();
        Random rand = new Random();
        for (int i = 1; i <= 20 ; i++) {
            Commentaire u = new Commentaire();

            int max = 1000000;
            int min = 0;
            int randomlikes = rand.nextInt((max - min)+1)+min;
            int randomdislikes = rand.nextInt((max - min)+1)+min;
            u.setDislikes(randomdislikes);
            u.setLikes(randomlikes);
            u.setCommentsTexte(faker.lorem().sentence(10));

            list.add(u);
        }
        comments.insertListCommentaire(list);

    }


    private void insertVideosMetaData(){
        List<Video> list = new ArrayList<>();

        for (int i = 1; i <= 20 ; i++) {
            Video u = new Video();
            Random rand = new Random();
            u.setCategory("Court Métrage :"+ i);
            u.setDescription(faker.lorem().sentence(10));
            int maxrating = 5;
            int minrating = 0;
            int randomrating = rand.nextInt((maxrating - minrating)+1)+minrating;
            u.setRating(randomrating);
            int max = 1000000;
            int min = 0;
            int randomviews = rand.nextInt((max - min)+1)+min;
            u.setViews(randomviews);
            u.setLink(faker.internet().domainName());
            u.setTitle(faker.name().title());
            list.add(u);
        }
        videoRepository.insertListVideos(list);

    }



    @Override
    public void run(String... args) throws Exception {
        insertUsers();
        inserComments();
        insertVideosMetaData();
    }
}
