package com.example.backend.service;


import com.example.backend.models.Commentaire;
import com.example.backend.models.Utilisateur;
import com.example.backend.models.Video;
import com.example.backend.repositories.CommentsRepository;
import com.example.backend.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final CommentsRepository commentsRepository;

    @Value("${video.storage.path}")
    private String videoStoragePath;

    @Value("${video.encoded.path}")
    private String encodedVideoPath;

    public VideoService(VideoRepository videoRepo, CommentsRepository commentRepo) {
        this.videoRepository = videoRepo;
        this.commentsRepository = commentRepo;
    }

    /**
     * Vérifie si FFmpeg est installé sur le système
     * @return true si FFmpeg est installé, false sinon
     */
    private boolean isFFmpegInstalled() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("ffmpeg", "-version");
            Process process = processBuilder.start();
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            return false;
        }
    }

    /**
     * Encode une vidéo au format 720p 30fps en utilisant FFmpeg.
     * Si FFmpeg n'est pas installé, stocke la vidéo originale sans encodage.
     * 
     * @param originalVideoPath Chemin vers la vidéo originale
     * @param uniqueFilename Nom de fichier unique
     * @return Le chemin vers la vidéo encodée
     */
    public String encodeVideo(String originalVideoPath, String uniqueFilename) throws IOException {
        // Créer le répertoire pour les vidéos encodées s'il n'existe pas
        Path encodedPath = Paths.get(encodedVideoPath);
        if (!Files.exists(encodedPath)) {
            Files.createDirectories(encodedPath);
        }

        // Vérifier si FFmpeg est installé, sinon copier simplement le fichier
        if (!isFFmpegInstalled()) {
            System.out.println("FFmpeg n'est pas installé, la vidéo ne sera pas encodée");
            String outputFilename = uniqueFilename;
            Path outputPath = encodedPath.resolve(outputFilename);
            Files.copy(Paths.get(originalVideoPath), outputPath);
            return outputFilename;
        }

        // Définir le chemin pour la vidéo encodée
        String outputFilename = uniqueFilename.substring(0, uniqueFilename.lastIndexOf(".")) + "_720p.mp4";
        String outputPath = encodedPath.resolve(outputFilename).toString();

        try {
            // Construire la commande FFmpeg pour l'encodage
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg",
                    "-i", originalVideoPath,
                    "-vf", "scale=-1:720",  // Résolution 720p (conserve le ratio d'aspect)
                    "-r", "30",             // 30 FPS
                    "-c:v", "libx264",      // Codec vidéo H.264
                    "-crf", "23",           // Qualité d'encodage (23 est un bon équilibre)
                    "-preset", "fast",      // Vitesse d'encodage "fast" au lieu de "medium" pour être plus rapide
                    "-c:a", "aac",          // Codec audio AAC
                    "-b:a", "128k",         // Bitrate audio 128kbps
                    outputPath              // Fichier de sortie
            );

            Process process = processBuilder.start();

            // Lire la sortie de FFmpeg pour le débogage
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("FFmpeg: " + line);
                }
            }

            // Attendre que l'encodage soit terminé
            try {
                int exitCode = process.waitFor();
                if (exitCode != 0) {
                    throw new IOException("FFmpeg a échoué avec le code de sortie: " + exitCode);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("L'encodage a été interrompu", e);
            }

            return outputFilename;
        } catch (IOException e) {
            System.err.println("Erreur lors de l'encodage de la vidéo: " + e.getMessage());
            
            // En cas d'échec de l'encodage, copier le fichier original
            String fallbackFilename = uniqueFilename;
            Path fallbackPath = encodedPath.resolve(fallbackFilename);
            Files.copy(Paths.get(originalVideoPath), fallbackPath);
            return fallbackFilename;
        }
    }

    /**
     * Récupère une vidéo par son ID et la renvoie en streaming
     * @param id ID de la vidéo
     * @return ResponseEntity contenant la vidéo ou une erreur
     */

    public ResponseEntity<?> getVideoResponse(int id) {
        Optional<Video> videoOpt = videoRepository.findById((long) id);

        if (videoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Video video = videoOpt.get();

        try {
            Path videoPath = Paths.get(encodedVideoPath).resolve(video.getLink());
            Resource resource = new UrlResource(videoPath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Incrémente le compteur de vues
                video.setViews(video.getViews() + 1);
                videoRepository.save(video);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("video/mp4"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erreur lors de la récupération de la vidéo: " + e.getMessage());
        }
    }

    public Video saveVideo(Video video) {
        return videoRepository.save(video);
    }

    public List<Video> findAllVideos() {
        return videoRepository.findAll();
    }

    public Optional<Video> getVideoById(long id){
        return videoRepository.findById(id);
    }

    public List<Video> findVideosByTitle (String query) {
        return videoRepository.findAllByTitleContainingIgnoreCase(query);
    }

    public List<Video> findVideosByCategory (String cat) {
        return videoRepository.findVideosByCategory(cat);
    }

    public List<Video> findAllByCreator (Utilisateur user){
        return videoRepository.findAllByCreator_Id(user.getId());
    }

    public Commentaire saveComment(Commentaire comment) {
        return commentsRepository.save(comment);
    }

    public List<Commentaire> findCommentaireByVid (int id) {
        return commentsRepository.findByVideo_Id(id);
    }

    public void deleteVideoComments (int id) {
        commentsRepository.findByVideo_Id(id).forEach(commentsRepository::delete);
    }

    /**
     * Supprime le fichier vidéo du système de fichiers
     * @param videoFilename Nom du fichier vidéo à supprimer
     * @throws IOException Si une erreur se produit lors de la suppression du fichier
     */
    public void deleteVideoFile(String videoFilename) throws IOException {
        // Supprimer la vidéo encodée
        Path encodedFile = Paths.get(encodedVideoPath).resolve(videoFilename);
        Files.deleteIfExists(encodedFile);

        // Essayer de supprimer la vidéo originale si elle existe encore
        // On détermine le nom probable du fichier original
        String originalFilename = videoFilename;
        if (originalFilename.endsWith("_720p.mp4")) {
            originalFilename = originalFilename.replace("_720p.mp4", originalFilename.substring(originalFilename.lastIndexOf(".")));
        }

        Path originalFile = Paths.get(videoStoragePath).resolve(originalFilename);
        Files.deleteIfExists(originalFile);
    }


    public void deleteVideo(Video video) {
        videoRepository.delete(video);
    }
}