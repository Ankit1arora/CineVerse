package com.cineverse.bookingservice.util;

import com.cineverse.bookingservice.dto.ScreenDto;
import com.cineverse.bookingservice.dto.TheatreDto;
import com.cineverse.bookingservice.entity.Screen;
import com.cineverse.bookingservice.entity.Theatre;
import com.cineverse.bookingservice.repository.TheatreRepository;
import com.cineverse.bookingservice.service.ScreenService;
import com.cineverse.bookingservice.service.TheatreService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TheatreService theatreService;
    private final ScreenService screenService;
    private final TheatreRepository theatreRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize simple sample data if empty
        if (theatreRepository.count() == 0) {
            
            // Create Theatre
            TheatreDto pvr = new TheatreDto();
            pvr.setName("PVR Cinemas");
            pvr.setLocation("Delhi");
            Theatre savedPvr = theatreService.createTheatre(pvr);

            // Create Screen
            ScreenDto audi1 = new ScreenDto();
            audi1.setName("Audi 1");
            audi1.setCapacity(100);
            audi1.setTheatreId(savedPvr.getId());
            screenService.createScreen(audi1);
            
            System.out.println("Sample Theatre and Screen Initialized!");
        }
    }
}
