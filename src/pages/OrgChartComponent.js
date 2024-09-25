import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './OrgChartComponent.css';

const OrgChartComponent = ({ users }) => {
  // Filtrer les utilisateurs en fonction de leur rôle
  const president = users.find(user => user.role_name === 'président');
  const advisors = users.filter(user => user.role_name === 'conseiller');
  const subAdvisors = users.filter(user => user.role_name === 'directeur');

  return (
    <div className="org-chart">
      {/* President Level */}
      {president && (
        <div className="rectangle level-1">
          <Avatar
            src={`http://127.0.0.1:5000/static/uploads/${president.profile_image}`}
            size={40}
            icon={<UserOutlined />}
          />
          <div className="name">
            {`${president.firstName} ${president.lastName}`}
          </div>
        </div>
      )}

      {/* Advisors Level */}
      {advisors.length > 0 && (
        <ol className="level-2-wrapper">
          {advisors.map(advisor => (
            <li key={advisor.id}>
              <div className="rectangle level-2">
                <Avatar
                  src={`http://127.0.0.1:5000/static/uploads/${advisor.profile_image}`}
                  size={40}
                  icon={<UserOutlined />}
                />
                <div className="name">{`${advisor.firstName} ${advisor.lastName}`}</div>
              </div>
              {/* Sub-Advisors Level */}
              <ol className="level-3-wrapper">
                {subAdvisors
                  .filter(subAdvisor => subAdvisor.superiorId === advisor.id)
                  .map(subAdvisor => (
                    <li key={subAdvisor.id}>
                      <div className="rectangle level-3">
                        <Avatar
                          src={`http://127.0.0.1:5000/static/uploads/${subAdvisor.profile_image}`}
                          size={40}
                          icon={<UserOutlined />}
                        />
                        <div className="name">{`${subAdvisor.firstName} ${subAdvisor.lastName}`}</div>
                      </div>
                    </li>
                  ))}
              </ol>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default OrgChartComponent;
