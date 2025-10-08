import {
    appointments,
    medicines,
    medicalRecords,
    orders,
    getUser,
  } from './firestore';
  import { query, where, getDocs, collection } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { User } from '../types';
  
  // Helper function to convert a string to Title Case for searching
  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
  
  // Helper function to generate a Google Maps link from an address string
  const createGoogleMapsLink = (address: string) => {
    if (!address) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  };
  
  export const searchDoctorsInFirestore = async (filters: any) => {
    const queryConstraints = [where('role', '==', 'doctor')];
  
    if (filters.specialization) {
      const normalizedSpecialization = toTitleCase(filters.specialization).replace(/ doctor$/i, '').trim();
      queryConstraints.push(where('doctorData.specialization', '>=', normalizedSpecialization));
      queryConstraints.push(where('doctorData.specialization', '<=', normalizedSpecialization + '\uf8ff'));
    }
  
    if (filters.minRating) {
      queryConstraints.push(where('doctorData.rating', '>=', filters.minRating));
    }
  
    const finalQuery = query(collection(db, 'users'), ...queryConstraints);
    const snapshot = await getDocs(finalQuery);
    
    // Enrich doctor data with comprehensive details
    return snapshot.docs.map((doc) => {
      const doctor = doc.data() as User;
      const address = doctor.doctorData?.clinicAddress || 'Address not available';
      return {
        id: doc.id,
        name: doctor.name,
        specialization: doctor.doctorData?.specialization,
        rating: doctor.doctorData?.rating,
        clinicName: doctor.doctorData?.clinicName || 'Clinic details not available',
        clinicAddress: address,
        googleMapsLink: createGoogleMapsLink(address),
      };
    });
  };
  
  export const searchMedicinesInFirestore = async (queryString: string) => {
    if (!queryString) return [];
  
    const normalizedQuery = toTitleCase(queryString);
  
    const q = query(
      medicines.collectionRef,
      where('name', '>=', normalizedQuery),
      where('name', '<=', normalizedQuery + '\uf8ff')
    );
  
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
  
    const medicinesData = snapshot.docs.map((doc) => ({
      ...(doc.data() as object),
      id: doc.id,
    }));
  
    // Enrich medicine data with comprehensive pharmacy details
    const enrichedMedicines = await Promise.all(
      medicinesData.map(async (medicine: any) => {
        if (medicine.pharmacyId) {
          const pharmacy = await getUser(medicine.pharmacyId);
          const address = pharmacy?.pharmacyData?.address || 'Address not available';
          return {
            ...medicine,
            pharmacyName: pharmacy?.pharmacyData?.name || 'Unknown Pharmacy',
            pharmacyAddress: address,
            googleMapsLink: createGoogleMapsLink(address),
          };
        }
        return { 
            ...medicine,
            pharmacyName: 'Unknown Pharmacy',
            pharmacyAddress: 'Address not available',
            googleMapsLink: '',
        };
      })
    );
  
    return enrichedMedicines;
  };
  
  export const searchHospitalsInFirestore = async (filters: any) => {
    const queryConstraints = [where('role', '==', 'hospital')];
  
    if (filters.facilities && filters.facilities.length > 0) {
      queryConstraints.push(where('hospitalData.facilities', 'array-contains-any', filters.facilities));
    }
  
    const q = query(collection(db, 'users'), ...queryConstraints);
  
    const snapshot = await getDocs(q);
    
    // Enrich hospital data with comprehensive details
    return snapshot.docs.map((doc) => {
        const hospital = doc.data() as User;
        const address = hospital.hospitalData?.address || 'Address not available';
        return {
            id: doc.id,
            name: hospital.hospitalData?.name,
            facilities: hospital.hospitalData?.facilities,
            address: address,
            googleMapsLink: createGoogleMapsLink(address),
        }
    });
  };
  
  // --- Other functions remain the same ---
  
  export const getPatientAppointments = async (patientId: string, filter: string) => {
    let q;
    switch (filter) {
      case 'upcoming':
        q = query(
          appointments.collectionRef,
          where('patientId', '==', patientId),
          where('date', '>=', new Date())
        );
        break;
      case 'past':
        q = query(
          appointments.collectionRef,
          where('patientId', '==', patientId),
          where('date', '<', new Date())
        );
        break;
      default:
        q = query(appointments.collectionRef, where('patientId', '==', patientId));
    }
  
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };
  
  export const getOrderFromFirestore = async (patientId: string, orderId?: string, amount?: number) => {
    if (orderId) {
      return orders.getById(orderId);
    }
    if (amount) {
      const q = query(
        orders.collectionRef,
        where('patientId', '==', patientId),
        where('totalAmount', '==', amount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }
    return [];
  };
  
  export const getPatientMedicalRecords = async (patientId: string) => {
    return medicalRecords.query('patientId', patientId);
  };
  