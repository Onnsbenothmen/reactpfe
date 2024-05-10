import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';

const { TextArea } = Input;
const { Option } = Select;

const CreateProgrammeVisite = () => {
    const [form] = Form.useForm();
    const [conseillers, setConseillers] = useState([]);
    const [adminEmails, setAdminEmails] = useState([]);
    const [emailContent, setEmailContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [emailObjective, setEmailObjective] = useState('Invitation à la Visite d’Évaluation');

    useEffect(() => {
        const fetchConseillers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/users?role=conseiller');
                setConseillers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAdminEmails = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/users?role=adminPublique');
                setAdminEmails(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchConseillers();
        fetchAdminEmails();
    }, []);

    const handleConfirm = async () => {
        try {
            // Générer le contenu de l'e-mail
            generateEmailContent();
            
            // Obtenir les valeurs du formulaire
            const formData = form.getFieldsValue();
            
            // Formater les données à envoyer au serveur Flask
            const requestData = {
                periode_debut: formData.periode_debut,
                periode_fin: formData.periode_fin,
                criteres_evaluation: formData.criteres_evaluation,
                lieu: formData.lieu,
                description: formData.description,
                contacts_urgence: formData.contacts_urgence,
                conseiller_email: formData.conseiller_email,
                admin_email: formData.admin_email[0] // Prendre le premier email de l'administration publique
            };
    
            // Envoyer les données au serveur Flask
            const response = await axios.post('http://127.0.0.1:5000/programme_visite', requestData);
    
            // Vérifier la réponse du serveur
            if (response.status === 201) {
                console.log("Programme de visite créé avec succès");
                // Ajouter ici toute autre logique de redirection ou de feedback utilisateur
            } else if (response.status === 404) {
                console.log("Utilisateur non trouvé");
                // Gérer l'erreur côté React, par exemple, afficher un message d'erreur à l'utilisateur
            }
    
            // Envoyer l'e-mail aux conseillers choisis
            const selectedConseillers = formData.conseiller_email;
            const emailData = {
                subject: emailObjective,
                content: emailContent
            };
            const responseEmail = await axios.post('http://127.0.0.1:5000/send_email', {
                conseillers: selectedConseillers,
                emailData: emailData
            });
            console.log(responseEmail.data);
    
            // Fermer la modale après la création
            setModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    
    

    const generateEmailContent = () => {
        const { periode_debut, periode_fin, criteres_evaluation, lieu, description, contacts_urgence } = form.getFieldsValue();

        // Formater les dates avec moment.js en français
        const formattedStartDate = moment(periode_debut).format("dddd D MMMM [à] HH:mm");
        const formattedEndDate = moment(periode_fin).format("dddd D MMMM [à] HH:mm");

        const content = `${emailObjective}
Cher(e) Conseiller(e),
J'espère que ce message vous trouve en bonne santé.
Dans le cadre de nos efforts continus pour améliorer la gouvernance locale, nous avons planifié une visite d'évaluation.
Cette visite est une occasion précieuse pour nous de mieux comprendre nos opérations,
d'identifier les domaines d'amélioration et de renforcer notre engagement envers la transparence et l'efficacité.
Détails de la visite :
La visite d’évaluation est prévue de 
${formattedStartDate} au ${formattedEndDate}
- Lieu : ${lieu}
- Critères d'évaluation : ${criteres_evaluation}
- Description : ${description}
- En cas d’indisponibilité, veuillez me contacter au numéro suivant : ${contacts_urgence}
Cordialement,
[Votre nom ou celui de votre organisation]`;

        setEmailContent(content);
    };

    const onFinish = () => {
        setModalVisible(true); // Afficher la modale pour confirmation
        generateEmailContent(); // Générer le contenu de l'email
    };


    return (
        <>
            <Form form={form} name="create-programme-visite" onFinish={onFinish} layout="vertical">
                <Form.Item name="periode_debut" label="Période Début" rules={[{ required: true }]}>
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item name="periode_fin" label="Période Fin" rules={[{ required: true }]}>
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item name="criteres_evaluation" label="Critères d'Évaluation" rules={[{ required: true }]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="lieu" label="Lieu" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="contacts_urgence" label="Contacts d'Urgence">
                    <Input />
                </Form.Item>
                <Form.Item name="conseiller_email" label="Emails des Conseillers" rules={[{ required: true }]}>
                    <Select mode="multiple" placeholder="Sélectionnez des emails">
                        {conseillers.map((conseiller) => (
                            <Option key={conseiller.id} value={conseiller.email}>{conseiller.email}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="admin_email" label="Email de l'Administration Publique" rules={[{ required: true }]}>
                    <Select placeholder="Sélectionnez un email">
                        {adminEmails.map((admin) => (
                            <Option key={admin.id} value={admin.email}>{admin.email}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Créer Programme de Visite
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                title="Confirmation"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalVisible(false)}>
                        Annuler
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleConfirm}>
                        Confirmer
                    </Button>,
                ]}
            >
                <Form.Item label="Objet de l'email">
                    <Input value={emailObjective} onChange={(e) => setEmailObjective(e.target.value)} />
                </Form.Item>
                <Form.Item label="Contenu de l'email">
                    <TextArea value={emailContent} rows={10} readOnly />
                </Form.Item>
            </Modal>
        </>
    );
};

<<<<<<< HEAD
export default CreateProgrammeVisite;
=======
export default CreateProgrammeVisite;
>>>>>>> ac2c1389012ae6032624b110112c700dc0446d19
