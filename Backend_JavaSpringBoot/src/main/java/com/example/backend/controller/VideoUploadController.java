package com.example.backend.controller;

import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.repositories.UtilisateurRepository;
import com.example.backend.repositories.VideoRepository;
import com.example.backend.service.UtilisateurService;
import com.example.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/videosUpload")
//Permet de recevoir des sockets via le header
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VideoUploadController {

    @Autowired
    private VideoService videoService;
    @Autowired
    private UtilisateurService utilisateurService;

    @Value("${video.storage.path}")
    private String videoStoragePath;

    @Value("${video.encoded.path}")
    private String encodedVideoPath;


    /**
     * 
     * @param file
     * @param title
     * @param description
     * @param username
     * @param category
     * @return
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file, @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("username") String username, @RequestParam(value = "category", required = false) String category) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Vérifier si le fichier est vide
            if (file.isEmpty()) {
                response.put("error", "Le fichier est vide");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Vérifier si l'utilisateur existe
            Utilisateur creator = utilisateurService.getUserByName(username);
            if (creator == null) {
                response.put("error", "Utilisateur non trouvé");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Générer un nom de fichier unique basé sur UUID
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                response.put("error", "Nom de fichier invalide");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Créer le chemin complet
            Path uploadPath = Paths.get(videoStoragePath);
            Path encodedPath = Paths.get(encodedVideoPath);

            // Créer les répertoires s'ils n'existent pas
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            if (!Files.exists(encodedPath)) {
                Files.createDirectories(encodedPath);
            }

            // Enregistrer le fichier original
            Path originalFilePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), originalFilePath);

            // Encoder la vidéo
            String encodedVideoFileName = videoService.encodeVideo(originalFilePath.toString(), uniqueFilename);

            // Créer une nouvelle entrée vidéo dans la base de données
            Video video = new Video();
            video.setTitle(title);
            video.setDescription(description != null ? description : "");
            video.setLink(encodedVideoFileName);
            video.setCreator(creator);
            video.setCategory(category != null ? category : "");
            video.setViews(0);
            video.setRating(0);

            videoService.saveVideo(video);

            response.put("success", true);
            response.put("videoId", video.getId());
            response.put("message", "Vidéo téléchargée et encodée avec succès");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Erreur lors du téléchargement: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVideo(@PathVariable int id) {
        return videoService.getVideoResponse(id);
    }
}