import {  useSelector ,useDispatch} from "react-redux";
import { setBasicInfo } from "../../../../Redux/projectSlice";
import {  useCallback, useState } from "react";
import SingleSelect from "../../../common/select/selects.component";
import axios from "axios";
import auth from "../../../../utils/AuthService";
import { config } from "../../../../config";
import { useEffect } from "react";
const ProjectDetails = () => {
  const { basicInfo } = useSelector((state) => state.project);
  const { editEnabled } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [clientOptions, setClientOptions] = useState([]);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const headers = auth.getHeaders();
  const [resourceManagerOptions, setResourceManagerOptions] = useState([]);
  const [workerOptions, setWorkerOptions] = useState([]);


  const getResourceManager = useCallback(async () => {
    try {
      return await axios.get(
        config.serverURL +"/resourcemanager?dropdownFilter=true&role=SALESMANAGER",

        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getResourceManager();
          if (response.status === 200) {
            setResourceManagerOptions(response.data);
          }
        }
      } catch (error) {
        if (!isCancelled && error.response?.status === 401)
          auth.logout();
      }
    };
    fetchData();
    return () => (isCancelled = true);
  }, []);

  const handleChangeResourceManager = (e) => {
    const resourceManager = resourceManagerOptions.filter(
      (item) => +item.resourceManagerId === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      resourceManager: { name: `${resourceManager?.firstName} ${resourceManager?.lastName}`, resourceManagerId: resourceManager?.resourceManagerId },
    });
  };

  const getWorkers = () => {
    if (auth.hasAdminRole() || auth.hasRecruiterRole()) {
      let headers = JSON.parse(sessionStorage.getItem("headers"));
      axios
        .get(config.serverURL + "/worker?dropdownFilter=true", { headers })
        .then((res) => {
          const workop = res.data;
          if (res.data) {
            setWorkerOptions(workop);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            auth.logout();
          }
        });
    }
  };

  useEffect(() => {
    getWorkers();
  }, []);

  const handleChangeWorker = (e) => {
    let worker = workerOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      worker: { id: worker.id },
    });
  };

  const getClients = useCallback(async () => {
    try {
      return await axios.get(
        config.serverURL + "/clients?dropdownFilter=true",
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getClients();
          if (response.status === 200) {
            setClientOptions(response.data);
          }
        }
      } catch (error) {
        if (!isCancelled && error.response?.status === 401)
          auth.logout();
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getClients]);

  const handleChangeClient = (e) => {
    const client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      client: { clientName: client.clientName, id: client.id, address: client.address },
    });
  };

  return (
    <>
      <h3 className="disabled-form-section-header">Details </h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
      <SingleSelect
        label="Client"
        name="clientId"
        onChange={handleChangeClient}
        value={basicInfo?.client?.id}
        options={clientOptions?.map((client) => {
          let id = client?.id;
          let name = `${client.clientName} (${client.address?.city || ""})`;
          return { id: id, name: name };
        })}
        disabled={!editEnabled}
      />
      <SingleSelect
        label="Resource Manager"
        name="resourceManagerId"
        onChange={handleChangeResourceManager}
        value={basicInfo?.resourceManager?.resourceManagerId}
        options={resourceManagerOptions?.map((resourceManager) => {
          let id = resourceManager?.resourceManagerId;
          let name = `${resourceManager?.firstName} ${resourceManager?.lastName}`;
          return { id: id, name: name };
        })}
        required
        disabled={!editEnabled}

      />
      <SingleSelect
                  label="worker"
                  name="workerId"
                  data-testid="worker-options"
                  onChange={handleChangeWorker}
                  value={basicInfo?.worker?.id}
                  options={workerOptions.map((worker) => {
                    let id = worker.id;
                    return {
                      id: id,
                      name: `${worker?.firstName} ${worker?.lastName}`,
                    };
                  })}
                  disabled={!editEnabled}

                  />
      </div>
    </>
  );
};

export default ProjectDetails;