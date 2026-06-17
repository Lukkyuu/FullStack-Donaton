package com.donaton.backend.donacion.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.donaton.backend.donacion.dto.DonacionDTO;
import com.donaton.backend.donacion.service.DonacionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

@ExtendWith(MockitoExtension.class)
class DonacionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DonacionService donacionService;

    @InjectMocks
    private DonacionController donacionController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(donacionController).build();
    }

    @Test
    void crearShouldReturnDonationResponse() throws Exception {
        DonacionDTO.Request request = new DonacionDTO.Request();
        request.setDescripcion("Caja de ropa");
        request.setCantidad(2);

        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(101L)
                .descripcion("Caja de ropa")
                .cantidad(2)
                .estado("PENDIENTE")
                .build();

        when(donacionService.crear(any(DonacionDTO.Request.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/donaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(101L))
                .andExpect(jsonPath("$.descripcion").value("Caja de ropa"));
    }

    @Test
    void listarTodasShouldReturnList() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .descripcion("Alimento")
                .estado("PENDIENTE")
                .build();

        when(donacionService.listarTodas()).thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/api/donaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void obtenerPorIdShouldReturnDonation() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .descripcion("Alimento")
                .estado("PENDIENTE")
                .build();

        when(donacionService.obtenerPorId(1L)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/donaciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void actualizarEstadoShouldReturnUpdatedDonation() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .estado("ENTREGADA")
                .build();

        when(donacionService.actualizarEstado(1L, "ENTREGADA")).thenReturn(mockResponse);

        mockMvc.perform(patch("/api/donaciones/1/estado")
                        .param("estado", "ENTREGADA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ENTREGADA"));
    }

    @Test
    void cancelarShouldCancelDonation() throws Exception {
        DonacionDTO.Response mockResponse = DonacionDTO.Response.builder()
                .id(1L)
                .estado("CANCELADA")
                .build();

        when(donacionService.cancelar(1L)).thenReturn(mockResponse);

        mockMvc.perform(post("/api/donaciones/1/cancelar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CANCELADA"));
    }

    @Test
    void listarCampanasShouldReturnDefaultCampaigns() throws Exception {
        mockMvc.perform(get("/api/donaciones/campanas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].titulo").value("Campaña de Invierno ❄"));
    }
}
