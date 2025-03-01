import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export function useContract() {
    const { contract, account } = useWeb3();
    const [loading, setLoading] = useState(false);

    // Doctor Registration
    const registerDoctor = async (name, specialization, licenseNumber) => {
        try {
            setLoading(true);
            const tx = await contract.registerDoctor(name, specialization, licenseNumber);
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error registering doctor:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Patient Management
    const addPatient = async (name, age, contactInfo) => {
        try {
            setLoading(true);
            const tx = await contract.addPatient(name, age, contactInfo);
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error adding patient:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const searchPatients = async (searchTerm, searchByName = true, searchByContact = false) => {
        try {
            const patients = await contract.searchPatients(searchTerm, searchByName, searchByContact);
            return patients;
        } catch (error) {
            console.error("Error searching patients:", error);
            throw error;
        }
    };

    // Medical Records
    const addMedicalRecord = async (patientId, diagnosis, prescription, notes, ipfsHash) => {
        try {
            setLoading(true);
            const tx = await contract.addMedicalRecord(
                patientId,
                diagnosis,
                prescription,
                notes,
                ipfsHash
            );
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error adding medical record:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getPatientRecords = async (patientId) => {
        try {
            const records = await contract.getPatientRecords(patientId);
            return records;
        } catch (error) {
            console.error("Error fetching patient records:", error);
            throw error;
        }
    };

    // Community Posts
    const createCommunityPost = async (title, content) => {
        try {
            setLoading(true);
            const tx = await contract.createCommunityPost(title, content);
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error creating community post:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAllCommunityPosts = async () => {
        try {
            const posts = await contract.getAllCommunityPosts();
            return posts;
        } catch (error) {
            console.error("Error fetching community posts:", error);
            throw error;
        }
    };

    return {
        loading,
        registerDoctor,
        addPatient,
        searchPatients,
        addMedicalRecord,
        getPatientRecords,
        createCommunityPost,
        getAllCommunityPosts
    };
} 