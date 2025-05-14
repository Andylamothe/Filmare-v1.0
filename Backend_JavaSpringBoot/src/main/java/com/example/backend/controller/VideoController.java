package com.example.backend.controller;

import com.example.backend.models.Commentaire;
import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.repositories.CommentsRepository;
import com.example.backend.repositories.UtilisateurRepository;
import com.example.backend.repositories.VideoRepository;
import com.example.backend.service.AppService;
import com.example.backend.service.UtilisateurService;
import com.example.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/videos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VideoController {

    @Autowired
    private VideoService videoService;
    @Autowired
    private UtilisateurService utilisateurService;

    public VideoController(UtilisateurService utilisateurService,
                           VideoService videoService) {
        this.utilisateurService = utilisateurService;
        this.videoService = videoService;
    }

    @GetMapping("/all")
    public List<Video> getAllVideos() {
        return videoService.findAllVideos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVideo(@PathVariable int id) {
        return videoService.getVideoResponse(id);
    }

    //ResponseEntity pris d'une vidéo Youtube
    //https://www.baeldung.com/spring-response-entity
    //ResponseEntity pour recevoir l'objet video par http
    //ResponseEntity te permet de personnaliser ta réponse HTTP
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getVideosByUsername(@PathVariable String username) {
        Utilisateur user = utilisateurService.getUserByName(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Video> videos = videoService.findAllByCreator(user);
        return ResponseEntity.ok(videos);
    }

    /**
     *
     * @return les 10 films les plus vues
     */
    @GetMapping("/trending")
    public List<Video> getTrendingVideos() {
        return videoService.findAllVideos().stream().sorted((v1, v2) ->
                Integer.compare(v2.getViews(), v1.getViews())).limit(10).toList();
    }



    /**
     * ResponseEntity va renvoyer une réponse HTTP
     * <?> Sert comme un blueprint pour créer un objet
     * La méthode ajoute un commentaire
     * @param id du commentaire
     * @param username de l'utilisateur
     * @param commentText Ce que l'utilisateur a écrit
     * @return sauvegarde le commentaire et envoie une réponse HTTP au frontend
     */
    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(@PathVariable int id, @RequestParam String username, @RequestParam String commentText) {

        //Optional pris de Youtube
        //Optional Veut dire que Ca peut contenir rien (Null)
        Optional<Video> videoOpt = videoService.getVideoById((long) id);
        Utilisateur user = utilisateurService.getUserByName(username);

        if (videoOpt.isEmpty() || user == null) {
            return ResponseEntity.notFound().build();
        }

        Commentaire comment = new Commentaire();
        comment.setCreator(user);
        comment.setCommentsTexte(commentText);
        comment.setLikes(0);
        comment.setDislikes(0);
        comment.setVideo(videoOpt.get());

        videoService.saveComment(comment);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("commentId", comment.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     *
     * @param id de la vidéo
     * @return soit Une reponse HTTP qui n'a rien trouvé ou le commentaire
     * avec une réponse HTTP
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getVideoDetails(@PathVariable int id) {
        Optional<Video> videoOpt = videoService.getVideoById((long) id);

        if (videoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOpt.get();

        // Récupérer les commentaires associés à cette vidéo
        List<Commentaire> comments = videoService.findCommentaireByVid(id);

        Map<String, Object> response = new HashMap<>();
        response.put("video", video);
        response.put("comments", comments);
        response.put("link", video.getLink());
        response.put("creator", video.getCreator());

        return ResponseEntity.ok(response);
    }

    /**
     *
     * @param id de la vidéo
     * @param username du créateur
     * @return la video supprimé
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable int id, @RequestParam String username) {
        Optional<Video> videoOpt = videoService.getVideoById((long) id);
        Utilisateur user = utilisateurService.getUserByName(username);

        if (videoOpt.isEmpty() || user == null) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOpt.get();

        // Vérifier que l'utilisateur est bien le créateur de la vidéo
        if (!video.getCreator().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vous n'êtes pas autorisé à supprimer cette vidéo");
        }

        // Supprimer tous les commentaires associés à cette vidéo
        videoService.deleteVideoComments(id);

        // Supprimer la vidéo
        videoService.deleteVideo(video);

        // Supprimer le fichier physique
        try {
            videoService.deleteVideoFile(video.getLink());
            return ResponseEntity.ok("Vidéo supprimée avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("La vidéo a été supprimée de la base de données mais pas du système de fichiers: " + e.getMessage());
        }
    }

    /**
     *
     * @param id de la vidéo
     * @param updatedVideo L'instance de la vidéo changé dans la base de donné
     * @param username du créateur de la vidéo
     * @return la vidéo updated
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVideo(@PathVariable int id, @RequestBody Video updatedVideo, @RequestParam String username) {
        Optional<Video> videoOpt = videoService.getVideoById((long) id);
        Utilisateur user = utilisateurService.getUserByName(username);

        if (videoOpt.isEmpty() || user == null) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOpt.get();

        // Vérifier que l'utilisateur est bien le créateur de la vidéo
        if (!video.getCreator().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Vous n'êtes pas autorisé à modifier cette vidéo");
        }

        // Mettre à jour uniquement les champs modifiables
        video.setTitle(updatedVideo.getTitle());
        video.setDescription(updatedVideo.getDescription());

        videoService.saveVideo(video);

        return ResponseEntity.ok(video);
    }

    /**
     *
     * @param id de la vidéo
     * @param username de l'utilisateur qui like
     * @return un like sur la vidéo
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeVideo(@PathVariable int id, @RequestParam String username) {
        Optional<Video> videoOpt = videoService.getVideoById((long) id);
        Utilisateur user = utilisateurService.getUserByName(username);

        if (videoOpt.isEmpty() || user == null) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOpt.get();
        
        // Système de rating
        video.setRating(video.getRating() + 1);
        videoService.saveVideo(video);

        return ResponseEntity.ok(video.getRating());
    }

    /**
     *
     * @param id de la vidéo
     * @param username de l'utilisateur qui Dislike
     * @return un Dislike sur la vidéo
     */
    @PostMapping("/{id}/dislike")
    public ResponseEntity<?> dislikeVideo(@PathVariable int id, @RequestParam String username) {
        Optional<Video> videoOpt = videoService.getVideoById((long) id);
        Utilisateur user = utilisateurService.getUserByName(username);

        if (videoOpt.isEmpty() || user == null) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOpt.get();
        
        // Système de rating
        video.setRating(video.getRating() - 1);
        videoService.saveVideo(video);

        return ResponseEntity.ok(video.getRating());
    }

    /**
     *
     * Envoie la string dans la barre de recherche du frontend
     * @return
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchVideos(@RequestParam String query) {
        // Recherche simple par titre
        List<Video> videos = videoService.findVideosByTitle(query);

        return ResponseEntity.ok(videos);
    }

    /**
     *
     * @param category
     * @return une réponse HTTP qui valide
     *
     */
    @GetMapping("/categories/{category}")
    public ResponseEntity<?> getVideosByCategory(@PathVariable String category) {
        List<Video> videos = videoService.findVideosByCategory(category);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}/stream")
    public ResponseEntity<?> streamVideo(@PathVariable int id) {
        return videoService.getVideoResponse(id);
    }
}