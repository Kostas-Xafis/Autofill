#include <stdio.h>
#include <stdlib.h>
#include <string.h>

        /* This C program was made to automate the saving of
            the db.json file from the download filepath to 
            the extension's path. Instead of doing it manually from 
            the browser.
        */
void wait(int a);

int main () {
    // Make sure to Ctrl+C to end the process
    int saves = 0;
    while(1){
        wait(saves);
        saves++;
    }

    return 0;
}

void wait(int saves){
    FILE * fdown, *frewr;

    char filePath[150], type[20];
    // PUT YOUR DOWNLOADS PATH BELOW!!!
    strcpy(filePath,  "C:/Users/poupa/downloads/db"+ * (saves > 0 ? saves + "0" : ""));
    strcpy(type, ".json");

    strcat(filePath, type);
    // Waiting for the file to be created in your downloads folder
    while((fdown = fopen(filePath,"r+")) == NULL){} 
    frewr = fopen("db.json", "w+");

    int c;
    while(1) {
        c = fgetc(fdown);
        if( feof(fdown) ){ 
            break ;
        }
        fprintf(frewr, "%c", c);
    }
    //You have to close fdown in order to remove the file! 
    fclose(fdown);
    fclose(frewr);

    if(remove(filePath) == 0){
        printf("Deleted successfully"); 
    }else{
        printf("Unable to delete the file"); 
    }
}