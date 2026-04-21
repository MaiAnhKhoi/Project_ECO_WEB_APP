package com.tlcn.fashion_api.mapper.address;

import com.tlcn.fashion_api.dto.request.AddressRequest;
import com.tlcn.fashion_api.dto.response.address.AddressResponse;
import com.tlcn.fashion_api.entity.address.Address;
import com.tlcn.fashion_api.entity.user.User;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(AddressRequest req, User user) {
        Address address = new Address();
        address.setUser(user);
        applyCommon(req, address);
        return address;
    }

    public void updateEntity(AddressRequest req, Address address) {
        applyCommon(req, address);
    }

    private void applyCommon(AddressRequest req, Address address) {
        String receiver = (req.getFirstName() + " " + req.getLastName()).trim();
        address.setReceiver(receiver);
        address.setPhone(req.getPhone());
        address.setLine1(req.getAddress1());

        // company có thể lưu vào line2, tuỳ bạn
        address.setLine2(req.getCompany());

        address.setCity(req.getCity());
        address.setProvince(req.getProvince());
        address.setCountry(req.getRegion()); // region = Country/region

        address.setIsDefault(Boolean.TRUE.equals(req.getIsDefault()));
    }

    public AddressResponse toDto(Address address) {
        String receiver = address.getReceiver() != null ? address.getReceiver() : "";
        String firstName = receiver;
        String lastName = "";

        int idx = receiver.indexOf(' ');
        if (idx > 0) {
            firstName = receiver.substring(0, idx);
            lastName = receiver.substring(idx + 1);
        }

        return AddressResponse.builder()
                .id(address.getId())
                .firstName(firstName)
                .lastName(lastName)
                .company(address.getLine2())
                .address1(address.getLine1())
                .city(address.getCity())
                .region(address.getCountry())
                .province(address.getProvince())
                .phone(address.getPhone())
                .isDefault(address.getIsDefault())
                .build();
    }
}