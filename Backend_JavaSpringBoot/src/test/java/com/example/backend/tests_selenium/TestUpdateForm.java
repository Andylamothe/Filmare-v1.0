package com.example.backend.tests_selenium;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.assertEquals;

//Doit etre modifier pour fonctionner
public class TestUpdateForm {
    private WebDriver driver = new FirefoxDriver();

    @BeforeEach
    public void setUp() {
        System.setProperty("webdriver.gecko.driver", "./datageckodriver.exe");
    }

    @Test
    public void testUpdateUser() {
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

        WebElement modifierInput = driver.findElement(By.id("modifier"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", modifierInput); //scroll down jusqu'au bouton modifier, sinon le bouton est pas on screen et peu pas être used
        for(double i=0;i<100000000d;i++) {
            i++; //timer pas du tout optimiser, faudrait use un thread, j'avais la flemme honestly
        }
        modifierInput.click();
        WebElement nameInput = driver.findElement(By.id("name"));
        WebElement lastNameInput = driver.findElement(By.id("lastName"));
        WebElement bioInput = driver.findElement(By.id("bio"));
        WebElement saveInput = driver.findElement(By.id("submit"));


        nameInput.sendKeys("rachid");
        lastNameInput.sendKeys("diams");
        bioInput.sendKeys("Realisateur");
        saveInput.click();

        WebElement username = driver.findElement(By.id("name"));

        assertEquals("rachid", username.getText());
    }


}
