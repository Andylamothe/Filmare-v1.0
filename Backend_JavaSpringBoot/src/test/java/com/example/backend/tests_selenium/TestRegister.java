package com.example.backend.tests_selenium;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.sql.SQLOutput;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;


public class TestRegister {
    private WebDriver driver = new FirefoxDriver();

    @BeforeEach
    public void setUp() {
        System.setProperty("webdriver.gecko.driver", "./datageckodriver.exe");
    }

    @Test
    public void testRegisterForm() {
        driver.get("http://localhost:80/register");
        WebElement usernameInput = driver.findElement(By.id("username"));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement emailInput = driver.findElement(By.id("email"));
        WebElement loginButton = driver.findElement(By.id("submit"));
        WebElement conditions = driver.findElement(By.id("conditions"));

        usernameInput.sendKeys("toto1");
        passwordInput.sendKeys("pwd_1");
        emailInput.sendKeys("toto@toto.com");
        conditions.click();
        loginButton.click();
    
        // Ne marche pas il faut mettre l'adresse du profil (/profile/1)
        String testUrl = "http://localhost/register";
        assertEquals(testUrl, driver.getCurrentUrl());
    }
}
