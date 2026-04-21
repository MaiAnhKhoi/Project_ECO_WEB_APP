package com.tlcn.fashion_api.service.address;

import com.tlcn.fashion_api.dto.request.AddressRequest;
import com.tlcn.fashion_api.dto.response.address.AddressResponse;
import com.tlcn.fashion_api.entity.address.Address;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.mapper.address.AddressMapper;
import com.tlcn.fashion_api.repository.address.AddressRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// ------------------ INTERFACE ------------------
@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses(Long userId) {
        return addressRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(addressMapper::toDto)
                .toList();
    }

    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Nếu isDefault = true → clear default cũ
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultForUser(userId);
        }

        Address address = addressMapper.toEntity(request, user);
        Address saved = addressRepository.save(address);
        return addressMapper.toDto(saved);
    }

    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultForUser(userId);
        }

        addressMapper.updateEntity(request, address);
        Address saved = addressRepository.save(address);
        return addressMapper.toDto(saved);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        addressRepository.delete(address);
    }

    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUser_Id(addressId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        addressRepository.clearDefaultForUser(userId);
        address.setIsDefault(true);
        Address saved = addressRepository.save(address);
        return addressMapper.toDto(saved);
    }
    @Transactional(readOnly = true)
    public AddressResponse getDefaultAddress(Long userId) {
        Address address = addressRepository.findByUser_IdAndIsDefaultTrue(userId)
                .orElseThrow(() -> new EntityNotFoundException("Default address not found"));
        return addressMapper.toDto(address);
    }
}