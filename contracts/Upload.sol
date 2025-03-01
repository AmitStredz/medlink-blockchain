// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Upload {
    struct Doctor {
        string name;
        string specialization;
        string licenseNumber;
        bool isRegistered;
        uint256 registrationDate;
    }

    struct Patient {
        string name;
        uint256 age;
        string contactInfo;
        uint256 registrationDate;
        bool isActive;
        string bloodGroup;
        string allergies;
    }

    struct MedicalRecord {
        uint256 patientId;
        string diagnosis;
        string prescription;
        string notes;
        string ipfsHash;
        uint256 timestamp;
        address doctor;
    }

    struct CommunityPost {
        address doctor;
        string title;
        string content;
        uint256 timestamp;
        bool isActive;
    }

    mapping(address => Doctor) public doctors;
    mapping(uint256 => Patient) public patients;
    mapping(uint256 => MedicalRecord[]) public patientRecords;
    mapping(address => uint256[]) public doctorPatients;
    CommunityPost[] public communityPosts;

    uint256 private patientCounter;
    uint256 private postCounter;

    event DoctorRegistered(address indexed doctorAddress, string name);
    event PatientAdded(uint256 indexed patientId, string name);
    event RecordAdded(uint256 indexed patientId, uint256 timestamp);
    event PostCreated(uint256 indexed postId, address indexed doctor);

    modifier onlyRegisteredDoctor() {
        require(doctors[msg.sender].isRegistered, "Not a registered doctor");
        _;
    }

    // Doctor registration
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        string memory _licenseNumber
    ) public {
        require(!doctors[msg.sender].isRegistered, "Doctor already registered");
        
        doctors[msg.sender] = Doctor({
            name: _name,
            specialization: _specialization,
            licenseNumber: _licenseNumber,
            isRegistered: true,
            registrationDate: block.timestamp
        });

        emit DoctorRegistered(msg.sender, _name);
    }

    // Add new patient
    function addPatient(
        string memory _name,
        uint256 _age,
        string memory _contactInfo
    ) public onlyRegisteredDoctor returns (uint256) {
        patientCounter++;
        
        patients[patientCounter] = Patient({
            name: _name,
            age: _age,
            contactInfo: _contactInfo,
            registrationDate: block.timestamp,
            isActive: true,
            bloodGroup: "",
            allergies: ""
        });

        doctorPatients[msg.sender].push(patientCounter);
        emit PatientAdded(patientCounter, _name);
        return patientCounter;
    }

    // Add medical record for a patient with IPFS hash
    function addMedicalRecord(
        uint256 _patientId,
        string memory _diagnosis,
        string memory _prescription,
        string memory _notes,
        string memory _ipfsHash
    ) public onlyRegisteredDoctor {
        require(patients[_patientId].isActive, "Patient not found or inactive");
        
        // Check if this doctor has access to this patient
        bool hasAccess = false;
        uint256[] memory doctorPatientsList = doctorPatients[msg.sender];
        for (uint256 i = 0; i < doctorPatientsList.length; i++) {
            if (doctorPatientsList[i] == _patientId) {
                hasAccess = true;
                break;
            }
        }
        require(hasAccess, "Doctor does not have access to this patient");

        MedicalRecord memory newRecord = MedicalRecord({
            patientId: _patientId,
            diagnosis: _diagnosis,
            prescription: _prescription,
            notes: _notes,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            doctor: msg.sender
        });

        patientRecords[_patientId].push(newRecord);
        emit RecordAdded(_patientId, block.timestamp);
    }

    // Get doctor's patients
    function getDoctorPatients() public view onlyRegisteredDoctor returns (uint256[] memory) {
        return doctorPatients[msg.sender];
    }

    // Search patients by name (basic implementation)
    function searchPatientsByName(string memory _searchName) 
        public 
        view 
        onlyRegisteredDoctor 
        returns (uint256[] memory) {
        uint256[] memory doctorPatientsList = doctorPatients[msg.sender];
        uint256[] memory matchingPatients = new uint256[](doctorPatientsList.length);
        uint256 matchCount = 0;

        for (uint256 i = 0; i < doctorPatientsList.length; i++) {
            if (keccak256(bytes(patients[doctorPatientsList[i]].name)) == keccak256(bytes(_searchName))) {
                matchingPatients[matchCount] = doctorPatientsList[i];
                matchCount++;
            }
        }

        return matchingPatients;
    }

    // Create community post
    function createCommunityPost(
        string memory _title,
        string memory _content
    ) public onlyRegisteredDoctor {
        communityPosts.push(CommunityPost({
            doctor: msg.sender,
            title: _title,
            content: _content,
            timestamp: block.timestamp,
            isActive: true
        }));

        emit PostCreated(postCounter++, msg.sender);
    }

    // Get all community posts
    function getAllCommunityPosts() public view returns (CommunityPost[] memory) {
        return communityPosts;
    }

    // Get patient records with additional access control
    function getPatientRecords(uint256 _patientId) 
        public 
        view 
        onlyRegisteredDoctor 
        returns (MedicalRecord[] memory) {
        require(patients[_patientId].isActive, "Patient not found or inactive");
        
        // Check if this doctor has access to this patient
        bool hasAccess = false;
        uint256[] memory doctorPatientsList = doctorPatients[msg.sender];
        for (uint256 i = 0; i < doctorPatientsList.length; i++) {
            if (doctorPatientsList[i] == _patientId) {
                hasAccess = true;
                break;
            }
        }
        require(hasAccess, "Doctor does not have access to this patient");

        return patientRecords[_patientId];
    }

    // Add this function for better patient search
    function searchPatients(
        string memory _searchTerm,
        bool searchByName,
        bool searchByContact
    ) public view onlyRegisteredDoctor returns (uint256[] memory) {
        uint256[] memory doctorPatientsList = doctorPatients[msg.sender];
        uint256[] memory matchingPatients = new uint256[](doctorPatientsList.length);
        uint256 matchCount = 0;

        for (uint256 i = 0; i < doctorPatientsList.length; i++) {
            uint256 patientId = doctorPatientsList[i];
            Patient memory patient = patients[patientId];
            
            if (searchByName && 
                containsString(patient.name, _searchTerm)) {
                matchingPatients[matchCount++] = patientId;
            }
            else if (searchByContact && 
                     containsString(patient.contactInfo, _searchTerm)) {
                matchingPatients[matchCount++] = patientId;
            }
        }

        // Trim array to actual size
        uint256[] memory result = new uint256[](matchCount);
        for (uint256 i = 0; i < matchCount; i++) {
            result[i] = matchingPatients[i];
        }
        return result;
    }

    // Helper function for string comparison
    function containsString(string memory _base, string memory _search) 
        internal 
        pure 
        returns (bool) {
        bytes memory baseBytes = bytes(_base);
        bytes memory searchBytes = bytes(_search);
        
        if (searchBytes.length > baseBytes.length) {
            return false;
        }
        
        // Convert to lowercase for case-insensitive search
        for (uint i = 0; i <= baseBytes.length - searchBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < searchBytes.length; j++) {
                if (toLowerCase(baseBytes[i + j]) != toLowerCase(searchBytes[j])) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        return false;
    }

    // Helper function to convert char to lowercase
    function toLowerCase(bytes1 _char) internal pure returns (bytes1) {
        if (_char >= 0x41 && _char <= 0x5A) {
            return bytes1(uint8(_char) + 32);
        }
        return _char;
    }
} 