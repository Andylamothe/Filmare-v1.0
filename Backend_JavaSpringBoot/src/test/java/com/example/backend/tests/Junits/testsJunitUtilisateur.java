package com.example.backend.tests.Junits;

import com.example.backend.models.Utilisateur;
import com.example.backend.repositories.CredentialRepository;
import com.example.backend.repositories.UtilisateurRepository;
import com.example.backend.service.AppService;
import com.example.backend.service.UtilisateurService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.InjectMock;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

//Test unitaire fait par Andy
public class TestsJunitUtilisateur {

    @Mock
    UtilisateurRepository utilisateurRepository;
    @Mock
    CredentialRepository credentialRepository;
    @InjectMock
    UtilisateurService usersService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        usersService = new UtilisateurService(utilisateurRepository,credentialRepository );
    }

    @Test
    void rechercheIdUtilisateur(){
        List<Utilisateur> inputList = new ArrayList<>();
        Utilisateur user = new Utilisateur();
        user.setName("toto");
        inputList.add(user);

        // Simulation du comportement du repository
        when(utilisateurRepository.saveAll(inputList)).thenReturn(inputList);

        List<Utilisateur> result = usersService.insertListUtilisateurs(inputList);

        assertEquals(inputList, result);
    }
}
